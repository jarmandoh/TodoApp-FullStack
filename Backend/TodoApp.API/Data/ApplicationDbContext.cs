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
            entity.HasOne(e => e.User)
                  .WithMany(u => u.TodoItems)
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

        modelBuilder.Entity<TodoItem>().HasData(
            new TodoItem
            {
                Id = 1,
                Title = "Completar prueba técnica",
                Description = "Desarrollar aplicación completa con Angular y .NET",
                IsCompleted = false,
                UserId = 1,
                CreatedAt = DateTime.UtcNow
            },
            new TodoItem
            {
                Id = 2,
                Title = "Revisar documentación",
                Description = "Revisar y completar README con instrucciones",
                IsCompleted = false,
                UserId = 1,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
