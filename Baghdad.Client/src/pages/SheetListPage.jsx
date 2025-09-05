import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5117";

function SheetListPage() {
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/sheets`)
      .then((response) => response.json())
      .then((data) => setSheets(data))
      .catch((error) => console.error("Error fetching sheets:", error));
  }, []);

  return (
    <div>
      <h2>Saved Spreadsheets</h2>
      <Link to="/sheets/new">Create New Sheet</Link>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sheets.map((sheet) => (
          <li key={sheet.id} style={{ margin: "10px 0", padding: "10px", border: "1px solid #444", borderRadius: "5px" }}>
            <Link to={`/sheets/${sheet.id}`}>
              <strong>{sheet.title}</strong>
              <br />
              <small>Last updated: {new Date(sheet.updatedAt).toLocaleString()}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SheetListPage;
