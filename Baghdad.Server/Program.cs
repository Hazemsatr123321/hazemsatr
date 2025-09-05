using Microsoft.EntityFrameworkCore;
using Baghdad.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// --- Configure Services ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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

// --- Configure Pipeline ---

// Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// --- API Endpoints ---

app.MapPost("/api/documents", async (DocumentDto docDto, AppDbContext db) => {
    var newDoc = new Document { Content = docDto.Content };
    db.Documents.Add(newDoc);
    await db.SaveChangesAsync();
    return Results.Created($"/api/documents/{newDoc.Id}", newDoc);
});

app.MapGet("/api/documents/{id}", async (string id, AppDbContext db) => {
    return await db.Documents.FindAsync(id)
        is Document doc
            ? Results.Ok(doc)
            : Results.NotFound();
});

app.MapGet("/api/status", () => {
    return new { Message = "Hello from the Baghdad Backend!" };
})
.WithName("GetStatus");

app.Run();

// DTO to prevent over-posting and separate concerns from the DB entity
public record DocumentDto(string? Id, string Content);
