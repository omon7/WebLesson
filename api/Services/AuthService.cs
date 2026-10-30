using ListingsApi.Auth;
using ListingsApi.Contracts;
using ListingsApi.Data;
using ListingsApi.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ListingsApi.Services;

public class AuthService(
    AppDbContext db,
    IPasswordHasher<User> hasher,
    TokenService tokens)
{
    public static string Normalize(string email) =>
        email.Trim().ToLowerInvariant();

    public async Task<AuthResponse> RegisterAsync(RegisterRequest r)
    {
        var user = new User
        {
            Email = Normalize(r.Email),
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = hasher.HashPassword(user, r.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Issue(user);
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest r)
    {
        var email = Normalize(r.Email);

        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
            return null;

        var result = hasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            r.Password);

        if (result == PasswordVerificationResult.Failed)
            return null;

        return Issue(user);
    }

    private AuthResponse Issue(User user)
    {
        var (token, expires) = tokens.Create(user);

        return new AuthResponse(
            token,
            expires,
            user.Id,
            user.Email);
    }
}