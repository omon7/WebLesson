using ListingsApi.Contracts;
using ListingsApi.Services;

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
        group.MapPost("/", async (
            CreateListingRequest request,
            ListingService service) =>
        {
            var listing = await service.CreateAsync(request);

            if (listing is null)
                return Results.BadRequest("Указанный район не существует.");

            return Results.Created(
                $"/api/listings/{listing.Id}",
                listing);
        })
        .WithName("CreateListing");

        // PUT /api/listings/1
        group.MapPut("/{id:int}", async (
            int id,
            UpdateListingRequest request,
            ListingService service) =>
        {
            var updated = await service.UpdateAsync(id, request);

            return updated
                ? Results.NoContent()
                : Results.NotFound();
        })
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
group.MapGet("/bad", async (ListingService service) =>
{
    return await service.BadListAsync();
})
.WithName("BadList");
        return app;
    }
}