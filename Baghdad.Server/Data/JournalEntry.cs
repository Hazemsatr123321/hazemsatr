namespace Baghdad.Server.Data;

public class JournalEntry
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<JournalEntryLine> Lines { get; set; } = new();
}
