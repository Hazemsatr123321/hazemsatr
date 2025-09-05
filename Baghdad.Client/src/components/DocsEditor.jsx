import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = "http://localhost:5117";

// Custom Toolbar Component
const CustomToolbar = ({ onSave }) => (
  <div id="toolbar">
    <button className="ql-bold" title="Bold"></button>
    <button className="ql-italic" title="Italic"></button>
    <button className="ql-underline" title="Underline"></button>
    <button onClick={onSave} style={{ marginLeft: "10px", padding: "3px 5px", cursor: "pointer" }}>Save</button>
  </div>
);

function DocsEditor() {
  const [value, setValue] = useState("");
  const { id: urlId } = useParams();
  const navigate = useNavigate();

  // Effect to load document from URL
  useEffect(() => {
    if (urlId) {
      fetch(`${API_URL}/api/documents/${urlId}`)
        .then((response) => {
          if (!response.ok) throw new Error("Document not found");
          return response.json();
        })
        .then((data) => setValue(data.content))
        .catch((error) => {
          console.error("Error loading document:", error);
          alert(error.message);
          navigate("/");
        });
    } else {
      setValue("");
    }
  }, [urlId, navigate]);

  const handleSave = () => {
    fetch(`${API_URL}/api/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Content: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Document saved with ID:", data.id);
        alert(`Document saved! ID: ${data.id}`);
        navigate(`/editor/${data.id}`);
      })
      .catch((error) => console.error("Error saving document:", error));
  };

  return (
    <div className="text-editor" style={{ height: "calc(100vh - 100px)", backgroundColor: "white" }}>
      <CustomToolbar onSave={handleSave} />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={{ toolbar: { container: "#toolbar" } }}
        style={{ height: "100%" }}
      />
    </div>
  );
}

export default DocsEditor;
