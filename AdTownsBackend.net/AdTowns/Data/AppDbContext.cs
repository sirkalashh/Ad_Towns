using AdTowns.Models;
using AdTowns.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace AdTowns.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Registration> Registrations { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new RegistrationConfiguration());
    }

    public override int SaveChanges()
    {
        EnsureEmailsAreLowercase();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        EnsureEmailsAreLowercase();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void EnsureEmailsAreLowercase()
    {
        var entries = ChangeTracker.Entries<Registration>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity.Email != null)
            {
                entry.Entity.Email = entry.Entity.Email.ToLowerInvariant();
            }
        }
    }
}
