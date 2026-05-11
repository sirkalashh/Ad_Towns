using AdTowns.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AdTowns.Data.Configurations;

public class RegistrationConfiguration : IEntityTypeConfiguration<Registration>
{
    public void Configure(EntityTypeBuilder<Registration> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(e => e.ReferenceId).IsRequired().HasMaxLength(9); // AT-XXXXXX
        builder.HasIndex(e => e.ReferenceId).IsUnique();

        builder.Property(e => e.Name).IsRequired().HasMaxLength(100);
        builder.Property(e => e.Business).HasMaxLength(200);

        builder.Property(e => e.Phone).IsRequired().HasMaxLength(15);
        builder.HasIndex(e => e.Phone).IsUnique();

        builder.Property(e => e.Email).IsRequired().HasMaxLength(150);
        builder.HasIndex(e => e.Email).IsUnique();

        builder.Property(e => e.City).IsRequired().HasMaxLength(100);

        builder.Property(e => e.Type).IsRequired().HasConversion<string>();

        builder.Property(e => e.Message).HasMaxLength(1000);

        builder.Property(e => e.IpAddress).HasColumnType("varchar(50)");
        
        builder.Property(e => e.SubmittedAt).HasDefaultValueSql("GETUTCDATE()");

        // Default values for boolean fields
        builder.Property(e => e.EmailSentToAdmin).HasDefaultValue(false);
        builder.Property(e => e.EmailSentToUser).HasDefaultValue(false);

        // Indexes
        builder.HasIndex(e => e.SubmittedAt).IsDescending();
        builder.HasIndex(e => new { e.City, e.Type });

        // Constraints
        builder.ToTable(t => 
        {
            t.HasCheckConstraint("CK_Registration_TermsAccepted", "[TermsAccepted] = 1");
            t.HasCheckConstraint("CK_Registration_Type", "[Type] IN ('Vendor', 'Buyer', 'Referrer')");
        });
    }
}
