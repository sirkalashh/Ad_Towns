namespace AdTowns.Dtos;

public class RegisterRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string? Business { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Message { get; set; }
    public bool TermsAccepted { get; set; }
}
