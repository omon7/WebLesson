
# Listings API

## Валидация объявлений

Для проверки данных используется FluentValidation.

Правила:
- Заголовок — от 5 до 200 символов.
- Цена — больше 0.
- Количество комнат — от 1 до 10.
- Адрес — не более 300 символов.
- Район должен существовать в базе данных.

## Пример ошибки валидации

При отправке объявления с заголовком короче 5 символов API возвращает HTTP 400.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json
```

Пример тела ответа:

```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "title": [
      "Не короче 5 символов"
    ]
  }
}
```

## API endpoints

- POST /api/listings — создание объявления.
- PUT /api/listings/{id} — редактирование объявления.
