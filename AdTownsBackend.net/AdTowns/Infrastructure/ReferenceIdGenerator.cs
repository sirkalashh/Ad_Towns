using AdTowns.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace AdTowns.Infrastructure;

public interface IReferenceIdGenerator
{
    Task<string> GenerateUniqueReferenceIdAsync(CancellationToken cancellationToken = default);
}

public class ReferenceIdGenerator : IReferenceIdGenerator
{
    private readonly AppDbContext _dbContext;
    private const string Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public ReferenceIdGenerator(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<string> GenerateUniqueReferenceIdAsync(CancellationToken cancellationToken = default)
    {
        for (int i = 0; i < 10; i++)
        {
            string newId = GenerateRandomId();
            bool exists = await _dbContext.Registrations.AnyAsync(r => r.ReferenceId == newId, cancellationToken);
            if (!exists)
            {
                return newId;
            }
        }

        throw new InvalidOperationException("Failed to generate a unique ReferenceId after 10 attempts.");
    }

    private static string GenerateRandomId()
    {
        Span<char> result = stackalloc char[9];
        result[0] = 'A';
        result[1] = 'T';
        result[2] = '-';

        Span<byte> randomBytes = stackalloc byte[6];
        RandomNumberGenerator.Fill(randomBytes);

        for (int i = 0; i < 6; i++)
        {
            result[i + 3] = Chars[randomBytes[i] % Chars.Length];
        }

        return new string(result);
    }
}
