using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using RazorLight;
using Microsoft.Extensions.Hosting;
using System.Reflection;
using System.Text.Json;
using System.Threading.RateLimiting;
using AdTowns;
using AdTowns.Data;
using AdTowns.HostedServices;
using AdTowns.Infrastructure.EmailQueue;
using AdTowns.Services.Email;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// 1. Forwarded Headers (behind proxy)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// 2. Controllers & JSON (camelCase and UTC DateTimes)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        // Optionally handle DateTime parsing/formatting via UTC converter if required.
        // But .NET 8 handles basic DateTime mapping ok. A custom converter ensures UTC.
        options.JsonSerializerOptions.Converters.Add(new UtcDateTimeConverter());
    });

// CORS
var frontendUrl = builder.Configuration["FrontendUrl"] ?? "https://adtowns.com";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            policy.WithOrigins(frontendUrl)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});
        

// 4. Rate Limiting for /api/register
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("RegistrationRateLimiter", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(15),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// 5. EF Core DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 6. DI Placeholders
builder.Services.AddScoped<AdTowns.Infrastructure.IReferenceIdGenerator, AdTowns.Infrastructure.ReferenceIdGenerator>();
builder.Services.AddScoped<AdTowns.Services.IRegistrationService, AdTowns.Services.RegistrationService>();
builder.Services.AddScoped<FluentValidation.IValidator<AdTowns.Dtos.RegisterRequestDto>, AdTowns.Validation.RegisterRequestValidator>();
builder.Services.AddScoped<IEmailSender, MailKitEmailSender>();
builder.Services.AddSingleton<IEmailQueue, ChannelEmailQueue>();
builder.Services.AddHostedService<EmailSenderHostedService>();
builder.Services.Configure<HostOptions>(options =>
    options.BackgroundServiceExceptionBehavior = BackgroundServiceExceptionBehavior.Ignore);
var isDevelopment = builder.Environment.IsDevelopment();
builder.Services.AddOptions<EmailSettings>()
    .Bind(builder.Configuration.GetSection("EmailSettings"))
    .PostConfigure(options =>
    {
        var smtpHost = builder.Configuration["BREVO_SMTP_HOST"];
        if (!string.IsNullOrWhiteSpace(smtpHost))
        {
            options.SmtpHost = smtpHost;
        }

        var smtpUser = builder.Configuration["BREVO_SMTP_USER"];
        if (!string.IsNullOrWhiteSpace(smtpUser))
        {
            options.SmtpUser = smtpUser;
        }

        var smtpPass = builder.Configuration["BREVO_SMTP_PASS"];
        if (!string.IsNullOrWhiteSpace(smtpPass))
        {
            options.SmtpPass = smtpPass;
        }

        var smtpPort = builder.Configuration["BREVO_SMTP_PORT"];
        if (!string.IsNullOrWhiteSpace(smtpPort) && int.TryParse(smtpPort, out var port))
        {
            options.SmtpPort = port;
        }

        var fromEmail = builder.Configuration["BREVO_SMTP_MAIL"];
        if (!string.IsNullOrWhiteSpace(fromEmail))
        {
            options.FromEmail = fromEmail;
        }

        if (!isDevelopment)
        {
            options.AllowInvalidCertificates = false;
        }
    })
    .Validate(ValidateEmailSettings, "Email settings are invalid.")
    .ValidateOnStart();
builder.Services.AddSingleton<IRazorLightEngine>(provider =>
{
    var environment = provider.GetRequiredService<IWebHostEnvironment>();
    return new RazorLightEngineBuilder()
        .UseFileSystemProject(environment.ContentRootPath)
        .SetOperatingAssembly(Assembly.GetEntryAssembly() ?? typeof(Program).Assembly)
        .UseMemoryCachingProvider()
        .Build();
});

// 7. Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseForwardedHeaders();

app.UseMiddleware<AdTowns.Middleware.ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseHttpsRedirection();



app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers();

app.Run();

static bool ValidateEmailSettings(EmailSettings settings)
{
    ArgumentNullException.ThrowIfNull(settings);

    return !string.IsNullOrWhiteSpace(settings.SmtpHost)
        && settings.SmtpPort > 0
        && !string.IsNullOrWhiteSpace(settings.SmtpUser)
        && !string.IsNullOrWhiteSpace(settings.SmtpPass)
        && !string.IsNullOrWhiteSpace(settings.FromEmail);
}

namespace AdTowns
{
    public class UtcDateTimeConverter : System.Text.Json.Serialization.JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (DateTime.TryParse(reader.GetString(), out var date))
                return date.ToUniversalTime();
            return DateTime.UtcNow;
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"));
        }
    }
}
