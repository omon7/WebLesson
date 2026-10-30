using System.Text;
using System.Text.Json;

using FluentValidation;

using ListingsApi.Auth;
using ListingsApi.Data;
using ListingsApi.Data.Entities;
using ListingsApi.Endpoints;
using ListingsApi.Services;
using ListingsApi.Validators;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=listings.db"));

// Services
builder.Services.AddScoped<ListingService>();
builder.Services.AddScoped<DistrictService>();
builder.Services.AddScoped<AuthService>();
// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

ValidatorOptions.Global.PropertyNameResolver =
    (type, member, expression) =>
        member is null
            ? null
            : JsonNamingPolicy.CamelCase.ConvertName(member.Name);

// ProblemDetails
builder.Services.AddProblemDetails();

// CORS
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()));

// JWT settings
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>()!;

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt"));

// Password hashing and token service
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddSingleton<TokenService>();

// JWT authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.MapInboundClaims = false;

        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt.Issuer,

            ValidateAudience = true,
            ValidAudience = jwt.Audience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt.Key))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Обработка ошибок
app.UseExceptionHandler();
app.UseStatusCodePages();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapOpenApi();

app.MapAuthEndpoints();
app.MapListingEndpoints();
app.MapDistrictEndpoints();

app.Run();