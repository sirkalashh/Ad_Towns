using AdTowns.Dtos;
using AdTowns.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace AdTowns.Controllers;

[ApiController]
[Route("api")]
public class RegisterController : ControllerBase
{
    private readonly IRegistrationService _registrationService;
    private readonly IValidator<RegisterRequestDto> _validator;

    public RegisterController(
        IRegistrationService registrationService,
        IValidator<RegisterRequestDto> validator)
    {
        _registrationService = registrationService;
        _validator = validator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName.ToLowerInvariant())
                .ToDictionary(g => g.Key, g => g.First().ErrorMessage);

            return BadRequest(new
            {
                success = false,
                code = "VALIDATION_ERROR",
                message = "Please correct the highlighted fields.",
                errors = errors
            });
        }

        var ipAddress = GetClientIpAddress();
        var userAgent = Request.Headers.UserAgent.ToString();

        var registration = await _registrationService.CreateRegistrationAsync(request, ipAddress, userAgent, cancellationToken);

        return Created("", new
        {
            success = true,
            message = "Registration successful! Check your email for confirmation.",
            data = new
            {
                referenceId = registration.ReferenceId,
                name = registration.Name,
                email = registration.Email,
                city = registration.City,
                type = registration.Type.ToString().ToLowerInvariant(),
                submittedAt = registration.SubmittedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") // Match ISO 8601 UTC
            }
        });
    }

    private string? GetClientIpAddress()
    {
        if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            var ips = forwardedFor.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries);
            if (ips.Length > 0)
            {
                return ips[0].Trim();
            }
        }
        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}
