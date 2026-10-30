using System.Security.Claims;

using ListingsApi.Auth;
using ListingsApi.Contracts;
using ListingsApi.Services;
using ListingsApi.Validators;

using Microsoft.AspNetCore.Http.HttpResults;

namespace ListingsApi.Endpoints;

public static class ListingEndpoints
{
    public static IEndpointRouteBuilder MapListingEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/listings");

        // GET /api/listings — публичный список
        group.MapGet("/", async (
            int? districtId,
            decimal? maxPrice,
            ListingService service) =>
        {
            var items = await service.GetAllAsync(districtId, maxPrice);
            return Results.Ok(items);
        })
        .WithName("GetListings")
        .WithSummary("Список объявлений с фильтром");
// GET /api/listings/mine — мои объявления
group.MapGet("/mine", async (
    ClaimsPrincipal user,
    ListingService service) =>
{
    var items = await service.GetMineAsync(user.GetUserId());
    return Results.Ok(items);
})
.RequireAuthorization()
.WithName("GetMyListings")
.WithSummary("Объявления текущего пользователя");
        // GET /api/listings/1 — публичное объявление
        group.MapGet("/{id:int}", async (
            int id,
            ListingService service) =>
        {
            var listing = await service.GetAsync(id);

            return listing is not null
                ? Results.Ok(listing)
                : Results.NotFound();
        })
        .WithName("GetListing");

        // POST /api/listings — создание только авторизованным
        group.MapPost("/", async Task<Results<Created<ListingResponse>, ValidationProblem>>(
            CreateListingRequest request,
            ClaimsPrincipal user,
            ListingService service) =>
        {
            var created = await service.CreateAsync(
                request,
                user.GetUserId());

            if (created is null)
            {
                return TypedResults.ValidationProblem(
                    new Dictionary<string, string[]>
                    {
                        ["districtId"] = ["Район не найден"]
                    });
            }

            return TypedResults.Created(
                $"/api/listings/{created.Id}",
                created);
        })
        .RequireAuthorization()
        .AddEndpointFilter<ValidationFilter<CreateListingRequest>>()
        .WithName("CreateListing");

        // PUT /api/listings/1 — изменение только автором
        group.MapPut("/{id:int}", async Task<Results<NoContent, NotFound, ForbidHttpResult>>(
            int id,
            UpdateListingRequest request,
            ClaimsPrincipal user,
            ListingService service) =>
        {
            return await service.UpdateAsync(
                id,
                request,
                user.GetUserId()) switch
            {
                ChangeResult.Ok =>
                    TypedResults.NoContent(),

                ChangeResult.NotFound =>
                    TypedResults.NotFound(),

                _ =>
                    TypedResults.Forbid()
            };
        })
        .RequireAuthorization()
        .AddEndpointFilter<ValidationFilter<UpdateListingRequest>>()
        .ProducesValidationProblem()
        .WithName("UpdateListing");

        // DELETE /api/listings/1 — удаление только автором
        group.MapDelete("/{id:int}", async Task<Results<NoContent, NotFound, ForbidHttpResult>>(
            int id,
            ClaimsPrincipal user,
            ListingService service) =>
        {
            return await service.DeleteAsync(
                id,
                user.GetUserId()) switch
            {
                ChangeResult.Ok =>
                    TypedResults.NoContent(),

                ChangeResult.NotFound =>
                    TypedResults.NotFound(),

                _ =>
                    TypedResults.Forbid()
            };
        })
        .RequireAuthorization()
        .WithName("DeleteListing");

        // Тестовый endpoint — сохраняем
        group.MapGet("/bad", async (ListingService service) =>
        {
            return await service.BadListAsync();
        })
        .WithName("BadList");

        return app;
    }
}