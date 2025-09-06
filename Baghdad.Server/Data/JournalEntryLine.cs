using System.ComponentModel.DataAnnotations.Schema;

namespace Baghdad.Server.Data;

public class JournalEntryLine
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public Account? Account { get; set; }
    public int JournalEntryId { get; set; }
    public JournalEntry? JournalEntry { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Debit { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Credit { get; set; }
}
