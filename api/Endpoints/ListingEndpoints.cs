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

        // GET /api/listings
        // GET /api/listings?districtId=1&maxPrice=50000
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

        // GET /api/listings/1
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

        // POST /api/listings
        group.MapPost("/", async Task<Results<Created<ListingResponse>, ValidationProblem>>(
            CreateListingRequest request,
            ListingService service) =>
        {
            var created = await service.CreateAsync(request);

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
        .AddEndpointFilter<ValidationFilter<CreateListingRequest>>()
        .WithName("CreateListing");

        // PUT /api/listings/1
        group.MapPut("/{id:int}", async Task<Results<NoContent, NotFound>>(
            int id,
            UpdateListingRequest request,
            ListingService service) =>
        {
            var updated = await service.UpdateAsync(id, request);

            return updated
                ? TypedResults.NoContent()
                : TypedResults.NotFound();
        })
        .AddEndpointFilter<ValidationFilter<UpdateListingRequest>>()
        .ProducesValidationProblem()
        .WithName("UpdateListing");

        // DELETE /api/listings/1
        group.MapDelete("/{id:int}", async (
            int id,
            ListingService service) =>
        {
            var deleted = await service.DeleteAsync(id);

            return deleted
                ? Results.NoContent()
                : Results.NotFound();
        })
        .WithName("DeleteListing");

        // Тестовый endpoint
        group.MapGet("/bad", async (ListingService service) =>
        {
            return await service.BadListAsync();
        })
        .WithName("BadList");

        return app;
    }
}