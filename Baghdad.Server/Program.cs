using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS middleware
app.UseCors("AllowAll");

// --- Document Storage and Endpoints ---

// In-memory document store
var documents = new ConcurrentDictionary<string, Document>();

app.MapPost("/api/documents", (Document doc) => {
    var id = Guid.NewGuid().ToString();
    var newDoc = doc with { Id = id };
    if (documents.TryAdd(id, newDoc))
    {
        return Results.Created($"/api/documents/{id}", newDoc);
    }
    return Results.StatusCode(500);
});

app.MapGet("/api/documents/{id}", (string id) => {
    return documents.TryGetValue(id, out var doc)
        ? Results.Ok(doc)
        : Results.NotFound();
});

app.MapGet("/api/status", () => {
    return new { Message = "Hello from the Baghdad Backend!" };
})
.WithName("GetStatus");

app.Run();

public record Document(string? Id, string Content);
