namespace AdTowns.Models;

public class Registration
{
    public Guid Id { get; set; }
    public string ReferenceId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Business { get; set; }
    public string Phone { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string City { get; set; } = null!;
    public RegistrationType Type { get; set; }
    public string? Message { get; set; }
    public bool TermsAccepted { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime SubmittedAt { get; set; }
    public bool EmailSentToAdmin { get; set; }
    public bool EmailSentToUser { get; set; }
    public DateTime? EmailSentAt { get; set; }
}
