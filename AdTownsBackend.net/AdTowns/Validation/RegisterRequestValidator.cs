using AdTowns.Dtos;
using FluentValidation;

namespace AdTowns.Validation;

public class RegisterRequestValidator : AbstractValidator<RegisterRequestDto>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MinimumLength(3).WithMessage("Name must be at least 3 characters.")
            .Matches(@"^[a-zA-Z\s]+$").WithMessage("Name can only contain letters and spaces.");

        RuleFor(x => x.Business)
            .MaximumLength(200).WithMessage("Business name cannot exceed 200 characters.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required.")
            .Matches(@"^[0-9]{10}$").WithMessage("Enter a valid 10-digit mobile number.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Enter a valid email address.");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required.");

        var allowedTypes = new[] { "vendor", "buyer", "referrer" };
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required.")
            .Must(type => allowedTypes.Contains(type.ToLowerInvariant()))
            .WithMessage("Type must be one of vendor, buyer, or referrer.");

        RuleFor(x => x.Message)
            .MaximumLength(1000).WithMessage("Message cannot exceed 1000 characters.");

        RuleFor(x => x.TermsAccepted)
            .Equal(true).WithMessage("You must accept the terms.");
    }
}
