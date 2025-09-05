import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5117";

function DocumentListPage() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/documents`)
      .then((response) => response.json())
      .then((data) => setDocuments(data))
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  return (
    <div>
      <h2>Saved Documents</h2>
      <Link to="/editor">Create New Document</Link>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {documents.map((doc) => (
          <li key={doc.id} style={{ margin: "10px 0", padding: "10px", border: "1px solid #444", borderRadius: "5px" }}>
            <Link to={`/editor/${doc.id}`}>
              <strong>{doc.title}</strong>
              <br />
              <small>Last updated: {new Date(doc.updatedAt).toLocaleString()}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentListPage;
