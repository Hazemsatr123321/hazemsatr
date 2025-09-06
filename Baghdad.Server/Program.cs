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

// --- Documents API Endpoints ---
app.MapGet("/api/documents", async (AppDbContext db) => await db.Documents.OrderByDescending(d => d.UpdatedAt).Select(d => new DocumentInfo(d.Id, d.Title, d.UpdatedAt)).ToListAsync());
app.MapPost("/api/documents", async (DocumentDto docDto, AppDbContext db) => {
    var newDoc = new Document { Title = docDto.Title, Content = docDto.Content };
    db.Documents.Add(newDoc);
    await db.SaveChangesAsync();
    return Results.Created($"/api/documents/{newDoc.Id}", newDoc);
});
app.MapPut("/api/documents/{id}", async (string id, DocumentDto updatedDoc, AppDbContext db) => {
    var doc = await db.Documents.FindAsync(id);
    if (doc is null) return Results.NotFound();
    doc.Title = updatedDoc.Title;
    doc.Content = updatedDoc.Content;
    doc.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.NoContent();
});
app.MapGet("/api/documents/{id}", async (string id, AppDbContext db) => await db.Documents.FindAsync(id) is Document doc ? Results.Ok(doc) : Results.NotFound());

// --- Sheets API Endpoints ---
app.MapGet("/api/sheets", async (AppDbContext db) => await db.Sheets.OrderByDescending(s => s.UpdatedAt).Select(s => new SheetInfo(s.Id, s.Title, s.UpdatedAt)).ToListAsync());
app.MapPost("/api/sheets", async (SheetDto sheetDto, AppDbContext db) => {
    var newSheet = new Sheet { Title = sheetDto.Title, Content = sheetDto.Content };
    db.Sheets.Add(newSheet);
    await db.SaveChangesAsync();
    return Results.Created($"/api/sheets/{newSheet.Id}", newSheet);
});
app.MapPut("/api/sheets/{id}", async (string id, SheetDto updatedSheet, AppDbContext db) => {
    var sheet = await db.Sheets.FindAsync(id);
    if (sheet is null) return Results.NotFound();
    sheet.Title = updatedSheet.Title;
    sheet.Content = updatedSheet.Content;
    sheet.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.NoContent();
});
app.MapGet("/api/sheets/{id}", async (string id, AppDbContext db) => await db.Sheets.FindAsync(id) is Sheet sheet ? Results.Ok(sheet) : Results.NotFound());

// --- Accounting API Endpoints ---
app.MapGet("/api/accounts", async (AppDbContext db) => await db.Accounts.OrderBy(a => a.Number).ToListAsync());
app.MapPost("/api/accounts", async (AccountDto accountDto, AppDbContext db) => {
    var newAccount = new Account {
        Number = accountDto.Number,
        Name = accountDto.Name,
        Type = accountDto.Type,
        Description = accountDto.Description
    };
    db.Accounts.Add(newAccount);
    await db.SaveChangesAsync();
    return Results.Created($"/api/accounts/{newAccount.Id}", newAccount);
});

app.MapGet("/api/status", () => new { Message = "Hello from the Baghdad Backend!" }).WithName("GetStatus");

app.Run();

// DTOs
public record DocumentDto(string? Id, string Title, string Content);
public record DocumentInfo(string Id, string Title, DateTime UpdatedAt);
public record SheetDto(string? Id, string Title, string Content);
public record SheetInfo(string Id, string Title, DateTime UpdatedAt);
public record AccountDto(string Number, string Name, AccountType Type, string? Description);
