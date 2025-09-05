import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = "http://localhost:5117";

// Custom Toolbar Component
const CustomToolbar = ({ onSave, onLoad }) => (
  <div id="toolbar">
    <button className="ql-bold" title="Bold"></button>
    <button className="ql-italic" title="Italic"></button>
    <button className="ql-underline" title="Underline"></button>
    <button onClick={onSave} style={{ marginLeft: "10px", padding: "3px 5px", cursor: "pointer" }}>Save</button>
    <button onClick={onLoad} style={{ marginLeft: "5px", padding: "3px 5px", cursor: "pointer" }}>Load</button>
  </div>
);

function DocsEditor() {
  const [value, setValue] = useState("");
  const [docId, setDocId] = useState(null);

  const modules = {
    toolbar: {
      container: "#toolbar",
    },
  };

  const handleSave = () => {
    fetch(`${API_URL}/api/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Content: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Document saved with ID:", data.id);
        setDocId(data.id);
        alert(`Document saved! ID: ${data.id}`);
      })
      .catch((error) => console.error("Error saving document:", error));
  };

  const handleLoad = () => {
    const idToLoad = prompt("Enter Document ID to load:", docId || "");
    if (!idToLoad) return;

    fetch(`${API_URL}/api/documents/${idToLoad}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Document not found");
        }
        return response.json();
      })
      .then((data) => {
        setValue(data.content);
        setDocId(data.id);
        console.log("Document loaded:", data.id);
      })
      .catch((error) => {
        console.error("Error loading document:", error);
        alert(error.message);
      });
  };

  return (
    <div className="text-editor" style={{ height: "calc(100vh - 100px)", backgroundColor: "white" }}>
      <CustomToolbar onSave={handleSave} onLoad={handleLoad} />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        style={{ height: "100%" }}
      />
    </div>
  );
}

export default DocsEditor;
