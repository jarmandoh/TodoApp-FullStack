using Microsoft.EntityFrameworkCore;
using TodoApp.API.Models;

namespace TodoApp.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<TodoItem> TodoItems { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Password).IsRequired();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Priority).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            entity.HasOne(e => e.User)
                  .WithMany(u => u.TodoItems)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
            entity.Property(e => e.IsRead).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Email = "admin@todoapp.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Name = "Administrator",
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 2,
                Email = "user@todoapp.com",
                Password = BCrypt.Net.BCrypt.HashPassword("User123!"),
                Name = "Test User",
                CreatedAt = DateTime.UtcNow
            }
        );

        var now = DateTime.UtcNow;
        modelBuilder.Entity<TodoItem>().HasData(
            new TodoItem
            {
                Id = 1,
                Title = "Completar prueba técnica",
                Description = "Desarrollar aplicación completa con Angular y .NET",
                IsCompleted = false,
                Priority = TodoPriority.High,
                UserId = 1,
                CreatedAt = now,
                UpdatedAt = now
            },
            new TodoItem
            {
                Id = 2,
                Title = "Revisar documentación",
                Description = "Revisar y completar README con instrucciones",
                IsCompleted = false,
                Priority = TodoPriority.Medium,
                UserId = 1,
                CreatedAt = now,
                UpdatedAt = now
            }
        );
    }
}
