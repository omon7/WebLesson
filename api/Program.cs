using System.Text.Json;

using FluentValidation;

using ListingsApi.Endpoints;
using ListingsApi.Services;
using ListingsApi.Data;
using ListingsApi.Validators;

using Microsoft.EntityFrameworkCore;

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

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Имена ошибок в JSON: title, price, rooms, districtId
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

var app = builder.Build();

// Обработка ошибок
app.UseExceptionHandler();
app.UseStatusCodePages();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

app.MapOpenApi();

app.MapListingEndpoints();
app.MapDistrictEndpoints();

app.Run();