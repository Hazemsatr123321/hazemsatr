import React, { useState, useEffect } from "react";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5117";

const initialColumns = () => [
  { columnId: "A", width: 100 }, { columnId: "B", width: 100 },
  { columnId: "C", width: 100 }, { columnId: "D", width: 100 },
];

const initialRows = (columns) => {
  const header = {
    rowId: "header",
    cells: columns.map((col) => ({ type: "header", text: col.columnId })),
  };
  const dataRows = Array.from({ length: 10 }, (_, i) => ({
    rowId: i,
    cells: columns.map(() => ({ type: "text", text: "" })),
  }));
  return [header, ...dataRows];
};

function SheetEditor() {
  const [title, setTitle] = useState("Untitled Sheet");
  const [columns, setColumns] = useState(initialColumns());
  const [rows, setRows] = useState(initialRows(columns));
  const { id: urlId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (urlId && urlId !== "new") {
      fetch(`${API_URL}/api/sheets/${urlId}`)
        .then(res => res.ok ? res.json() : Promise.reject("Sheet not found"))
        .then(data => {
          setTitle(data.title);
          const parsedContent = JSON.parse(data.content);
          setColumns(parsedContent.columns);
          setRows(parsedContent.rows);
        })
        .catch(err => {
          alert(err);
          navigate("/sheets");
        });
    } else {
      const newCols = initialColumns();
      setTitle("Untitled Sheet");
      setColumns(newCols);
      setRows(initialRows(newCols));
    }
  }, [urlId, navigate]);

  const handleChanges = (changes) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      changes.forEach(change => {
        const rowIndex = newRows.findIndex(row => row.rowId === change.rowId);
        if (rowIndex > -1) {
            const cellIndex = columns.findIndex(col => col.columnId === change.columnId);
            if (cellIndex > -1) {
                newRows[rowIndex].cells[cellIndex] = { ...newRows[rowIndex].cells[cellIndex], text: change.newCell.text };
            }
        }
      });
      return newRows;
    });
  };

  const handleSave = () => {
    const isUpdating = urlId && urlId !== "new";
    const url = isUpdating ? `${API_URL}/api/sheets/${urlId}` : `${API_URL}/api/sheets`;
    const method = isUpdating ? "PUT" : "POST";
    const content = JSON.stringify({ columns, rows });

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Id: urlId, Title: title, Content: content }),
    })
    .then(res => {
      if (!res.ok && !isUpdating) throw new Error("Failed to save sheet");
      if (isUpdating) {
        alert("Sheet updated!");
        return;
      }
      return res.json();
    })
    .then(data => {
      if (data) {
        alert(`Sheet saved! ID: ${data.id}`);
        navigate(`/sheets/${data.id}`);
      }
    })
    .catch(err => alert(err.message));
  };

  return (
    <div>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Sheet Title" style={{ padding: "5px", margin: "5px" }}/>
      <button onClick={handleSave} style={{ padding: "5px" }}>Save</button>
      <div style={{ marginTop: "10px" }}>
        <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges} />
      </div>
    </div>
  );
}

export default SheetEditor;
