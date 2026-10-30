using ListingsApi.Contracts;
using ListingsApi.Data;
using ListingsApi.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ListingsApi.Services;

public enum ChangeResult
{
    Ok,
    NotFound,
    Forbidden
}

public class ListingService
{
    private readonly AppDbContext db;

    public ListingService(AppDbContext db)
    {
        this.db = db;
    }

    public async Task<List<ListingResponse>> GetAllAsync(
        int? districtId,
        decimal? maxPrice)
    {
        var query = db.Listings
            .AsNoTracking()
            .Include(x => x.District)
            .AsQueryable();

        if (districtId is not null)
            query = query.Where(x => x.DistrictId == districtId);

        if (maxPrice is not null)
            query = query.Where(x => x.Price <= maxPrice);

        var items = await query
            .OrderBy(x => x.Id)
            .ToListAsync();

        return items.Select(ToResponse).ToList();
    }

    // Объявления текущего пользователя
    public async Task<List<ListingResponse>> GetMineAsync(int userId)
    {
        var listings = await db.Listings
            .AsNoTracking()
            .Include(x => x.District)
            .Where(x => x.OwnerId == userId)
            .OrderBy(x => x.Id)
            .ToListAsync();

        return listings.Select(ToResponse).ToList();
    }

    public async Task<ListingResponse?> GetAsync(int id)
    {
        var listing = await db.Listings
            .AsNoTracking()
            .Include(x => x.District)
            .FirstOrDefaultAsync(x => x.Id == id);

        return listing is null
            ? null
            : ToResponse(listing);
    }

    public async Task<ListingResponse?> CreateAsync(
        CreateListingRequest request,
        int ownerId)
    {
        var districtExists = await db.Districts
            .AnyAsync(x => x.Id == request.DistrictId);

        if (!districtExists)
            return null;

        var listing = new Listing
        {
            Title = request.Title,
            Price = request.Price,
            Rooms = request.Rooms,
            DistrictId = request.DistrictId,
            Address = request.Address,
            CreatedAt = DateTime.UtcNow,
            OwnerId = ownerId
        };

        db.Listings.Add(listing);
        await db.SaveChangesAsync();

        var created = await db.Listings
            .AsNoTracking()
            .Include(x => x.District)
            .FirstAsync(x => x.Id == listing.Id);

        return ToResponse(created);
    }

    public async Task<ChangeResult> UpdateAsync(
        int id,
        UpdateListingRequest request,
        int userId)
    {
        var listing = await db.Listings.FindAsync(id);

        if (listing is null)
            return ChangeResult.NotFound;

        if (listing.OwnerId != userId)
            return ChangeResult.Forbidden;

        listing.Title = request.Title;
        listing.Price = request.Price;
        listing.Rooms = request.Rooms;
        listing.DistrictId = request.DistrictId;
        listing.Address = request.Address;

        await db.SaveChangesAsync();

        return ChangeResult.Ok;
    }

    public async Task<ChangeResult> DeleteAsync(
        int id,
        int userId)
    {
        var listing = await db.Listings.FindAsync(id);

        if (listing is null)
            return ChangeResult.NotFound;

        if (listing.OwnerId != userId)
            return ChangeResult.Forbidden;

        db.Listings.Remove(listing);
        await db.SaveChangesAsync();

        return ChangeResult.Ok;
    }

    private static ListingResponse ToResponse(Listing listing)
    {
        return new ListingResponse(
            listing.Id,
            listing.Title,
            listing.Price,
            listing.Rooms,
            listing.DistrictId,
            listing.District?.Name ?? "",
            listing.Address,
            listing.CreatedAt,
            listing.OwnerId);
    }

    public async Task<List<string>> BadListAsync()
    {
        var listings = await db.Listings
            .Include(l => l.District)
            .ToListAsync();

        return listings
            .Select(l => $"{l.Title} — {l.District!.Name}")
            .ToList();
    }
}