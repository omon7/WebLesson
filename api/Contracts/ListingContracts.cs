namespace ListingsApi.Contracts;

// Что клиент присылает при создании
public record CreateListingRequest(
    string Title,
    decimal Price,
    int DistrictId,
    int Rooms,
    string? Address);

// Что клиент присылает при полной замене
public record UpdateListingRequest(
    string Title,
    decimal Price,
    int DistrictId,
    int Rooms,
    string? Address);

// Что клиент получает
public record ListingResponse(
    int Id,
    string Title,
    decimal Price,
    int Rooms,
    int DistrictId,
    string DistrictName,
    string? Address,
    DateTime CreatedAt);
    public record DistrictResponse(
    int Id,
    string Name,
    int ListingsCount);