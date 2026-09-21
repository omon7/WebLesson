var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(p => p
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());

app.MapGet("/api/listings", () => new[]
{
    new { id = 1, title = "2-комнатная, Юнусабад", price = 62000 },
    new { id = 2, title = "Студия, Чиланзар", price = 41000 },
    new { id = 3, title = "1-комнатная, Мирзо-Улугбек", price = 35000 },
    new { id = 4, title = "3-комнатная, Сергели", price = 55000 },
    new { id = 5, title = "2-комнатная, Шайхантахур", price = 48000 }
});
app.MapGet("/api/listings/{id}", (int id) =>
{
    var listings = new[]
    {
        new { id = 1, title = "2-комнатная, Юнусабад", price = 62000 },
        new { id = 2, title = "Студия, Чиланзар", price = 41000 },
        new { id = 3, title = "1-комнатная, Мирзо-Улугбек", price = 35000 },
        new { id = 4, title = "3-комнатная, Сергели", price = 55000 },
        new { id = 5, title = "2-комнатная, Шайхантахур", price = 48000 }
    };

    var listing = listings.FirstOrDefault(x => x.id == id);

    return listing is not null
        ? Results.Ok(listing)
        : Results.NotFound();
});
app.Run();