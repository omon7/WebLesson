using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace ListingsApi.Auth;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user) =>
        int.Parse(user.FindFirstValue(JwtRegisteredClaimNames.Sub)!);
}