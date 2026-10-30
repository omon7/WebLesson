using FluentValidation;

namespace ListingsApi.Validators;

public class ValidationFilter<T>(IValidator<T> validator) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext ctx,
        EndpointFilterDelegate next)
    {
        // Получаем DTO из аргументов endpoint
        var request = ctx.Arguments.OfType<T>().FirstOrDefault();

        if (request is null)
        {
            return TypedResults.Problem(
                "Пустое тело запроса",
                statusCode: 400
            );
        }

        // Запускаем асинхронную проверку
        var result = await validator.ValidateAsync(
            request,
            ctx.HttpContext.RequestAborted
        );

        if (!result.IsValid)
        {
            return TypedResults.ValidationProblem(result.ToDictionary());
        }

        // Если ошибок нет — продолжаем выполнение endpoint
        return await next(ctx);
    }
}