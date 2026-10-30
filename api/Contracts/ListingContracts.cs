namespace ListingsApi.Contracts;

// Общие поля для создания и редактирования объявления
public interface IListingFields
{
    string Title { get; }
    decimal Price { get; }
    int Rooms { get; }
    int DistrictId { get; }
    string? Address { get; }
}

public record CreateListingRequest(
    string Title,
    decimal Price,
    int Rooms,
    int DistrictId,
    string? Address
) : IListingFields;

public record UpdateListingRequest(
    string Title,
    decimal Price,
    int Rooms,
    int DistrictId,
    string? Address
) : IListingFields;

public record ListingResponse(
    int Id,
    string Title,
    decimal Price,
    int Rooms,
    int DistrictId,
    string DistrictName,
    string? Address,
    DateTime CreatedAt,
    int? OwnerId
);

public record DistrictResponse(
    int Id,
    string Name,
    int ListingsCount
);