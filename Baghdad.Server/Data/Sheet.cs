namespace Baghdad.Server.Data;

public class Sheet
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = "Untitled Sheet";
    public string Content { get; set; } = "[]";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
