import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5117";

function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState(0); // Default to Asset
  const [accountDescription, setAccountDescription] = useState("");

  const fetchAccounts = () => {
    fetch(`${API_URL}/api/accounts`)
      .then((response) => response.json())
      .then((data) => setAccounts(data))
      .catch((error) => console.error("Error fetching accounts:", error));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAccount = {
      Number: accountNumber,
      Name: accountName,
      Type: parseInt(accountType, 10),
      Description: accountDescription,
    };

    fetch(`${API_URL}/api/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAccount),
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to create account");
        fetchAccounts(); // Refresh the list
        // Clear form
        setAccountNumber("");
        setAccountName("");
        setAccountType(0);
        setAccountDescription("");
    })
    .catch(error => alert(error.message));
  };

  return (
    <div>
      <h2>Chart of Accounts</h2>

      {/* Add New Account Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h3>Add New Account</h3>
        <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Number" required />
        <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="Name" required />
        <select value={accountType} onChange={e => setAccountType(e.target.value)}>
          <option value="0">Asset</option>
          <option value="1">Liability</option>
          <option value="2">Equity</option>
          <option value="3">Revenue</option>
          <option value="4">Expense</option>
        </select>
        <input type="text" value={accountDescription} onChange={e => setAccountDescription(e.target.value)} placeholder="Description" />
        <button type="submit">Add Account</button>
      </form>

      {/* Accounts Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id}>
              <td>{acc.number}</td>
              <td>{acc.name}</td>
              <td>{acc.type}</td>
              <td>{acc.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChartOfAccountsPage;
