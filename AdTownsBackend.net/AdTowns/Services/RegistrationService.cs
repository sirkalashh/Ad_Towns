using AdTowns.Data;
using AdTowns.Dtos;
using AdTowns.Models;
using AdTowns.Infrastructure;
using AdTowns.Infrastructure.EmailQueue;
using AdTowns.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace AdTowns.Services;

public interface IRegistrationService
{
    Task<Registration> CreateRegistrationAsync(RegisterRequestDto request, string? ipAddress, string? userAgent, CancellationToken cancellationToken = default);
}

public class RegistrationService : IRegistrationService
{
    private readonly AppDbContext _dbContext;
    private readonly IReferenceIdGenerator _idGenerator;
    private readonly IEmailQueue _emailQueue;

    public RegistrationService(
        AppDbContext dbContext,
        IReferenceIdGenerator idGenerator,
        IEmailQueue emailQueue)
    {
        _dbContext = dbContext;
        _idGenerator = idGenerator;
        _emailQueue = emailQueue;
    }

    public async Task<Registration> CreateRegistrationAsync(RegisterRequestDto request, string? ipAddress, string? userAgent, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var normalizedEmail = request.Email?.Trim();
        var normalizedPhone = request.Phone?.Trim();

        if (!string.IsNullOrWhiteSpace(normalizedEmail))
        {
            var emailExists = await _dbContext.Registrations
                .AsNoTracking()
                .AnyAsync(r => r.Email == normalizedEmail, cancellationToken);
            if (emailExists)
            {
                throw new DuplicateEntryException("email", "This email address is already registered.");
            }
        }

        if (!string.IsNullOrWhiteSpace(normalizedPhone))
        {
            var phoneExists = await _dbContext.Registrations
                .AsNoTracking()
                .AnyAsync(r => r.Phone == normalizedPhone, cancellationToken);
            if (phoneExists)
            {
                throw new DuplicateEntryException("phone", "This phone number is already registered.");
            }
        }

        var referenceId = await _idGenerator.GenerateUniqueReferenceIdAsync(cancellationToken);

        var registration = new Registration
        {
            ReferenceId = referenceId,
            Name = request.Name,
            Business = request.Business,
            Phone = normalizedPhone ?? request.Phone,
            Email = normalizedEmail ?? request.Email,
            City = request.City,
            Type = Enum.Parse<RegistrationType>(request.Type, ignoreCase: true),
            Message = request.Message,
            TermsAccepted = request.TermsAccepted,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            SubmittedAt = DateTime.UtcNow
        };

        _dbContext.Registrations.Add(registration);

        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && (sqlEx.Number == 2601 || sqlEx.Number == 2627))
        {
            if (sqlEx.Message.Contains("IX_Registrations_Email"))
            {
                throw new DuplicateEntryException("email", "This email address is already registered.");
            }
            if (sqlEx.Message.Contains("IX_Registrations_Phone"))
            {
                throw new DuplicateEntryException("phone", "This phone number is already registered.");
            }
            throw;
        }

        await _emailQueue.EnqueueAsync(registration.Id, cancellationToken);

        return registration;
    }
}
