namespace ListingsApi.Contracts;

// Что клиент присылает при создании
public record CreateListingRequest(
    string Title,
    decimal Price,
    string District,
    int Rooms,
    string Address);

// Что клиент присылает при полной замене
public record UpdateListingRequest(
    string Title,
    decimal Price,
    string District,
    int Rooms,
    string Address);

// Что клиент получает
public record ListingResponse(
    int Id,
    string Title,
    decimal Price,
    string District,
    int Rooms,
    string Address,
    DateTime CreatedAt);