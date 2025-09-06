namespace Baghdad.Server.Data;

public enum AccountType { Asset, Liability, Equity, Revenue, Expense }

public class Account
{
    public int Id { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public AccountType Type { get; set; }
    public string? Description { get; set; }
}
