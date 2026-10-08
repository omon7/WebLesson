using ListingsApi.Contracts;
using ListingsApi.Data;
using ListingsApi.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ListingsApi.Services;

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
        CreateListingRequest request)
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
            CreatedAt = DateTime.UtcNow
        };

        db.Listings.Add(listing);
        await db.SaveChangesAsync();

        var created = await db.Listings
            .AsNoTracking()
            .Include(x => x.District)
            .FirstAsync(x => x.Id == listing.Id);

        return ToResponse(created);
    }

    public async Task<bool> UpdateAsync(
        int id,
        UpdateListingRequest request)
    {
        var listing = await db.Listings
            .FirstOrDefaultAsync(x => x.Id == id);

        if (listing is null)
            return false;

        var districtExists = await db.Districts
            .AnyAsync(x => x.Id == request.DistrictId);

        if (!districtExists)
            return false;

        listing.Title = request.Title;
        listing.Price = request.Price;
        listing.Rooms = request.Rooms;
        listing.DistrictId = request.DistrictId;
        listing.Address = request.Address;

        await db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var listing = await db.Listings
            .FindAsync(id);

        if (listing is null)
            return false;

        db.Listings.Remove(listing);
        await db.SaveChangesAsync();

        return true;
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
            listing.CreatedAt);
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