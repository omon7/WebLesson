namespace ListingsApi.Contracts;

public record RegisterRequest(string Email, string Password);

public record LoginRequest(string Email, string Password);

public record AuthResponse(
    string Token,
    DateTime ExpiresAt,
    int UserId,
    string Email);

public record MeResponse(int Id, string Email);