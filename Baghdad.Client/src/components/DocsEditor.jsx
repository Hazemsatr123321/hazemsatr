import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = "http://localhost:5117";

// Toolbar now also takes title and onTitleChange props
const CustomToolbar = ({ onSave, title, onTitleChange }) => (
  <div id="toolbar">
    <input
      type="text"
      value={title}
      onChange={onTitleChange}
      placeholder="Document Title"
      style={{ width: "200px", marginRight: "10px", padding: "3px" }}
    />
    <button className="ql-bold" title="Bold"></button>
    <button className="ql-italic" title="Italic"></button>
    <button className="ql-underline" title="Underline"></button>
    <button onClick={onSave} style={{ marginLeft: "10px", padding: "3px 5px", cursor: "pointer" }}>Save</button>
  </div>
);

function DocsEditor() {
  const [title, setTitle] = useState("Untitled Document");
  const [content, setContent] = useState("");
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
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
        })
        .catch((error) => {
          console.error("Error loading document:", error);
          alert(error.message);
          navigate("/");
        });
    } else {
      setTitle("Untitled Document");
      setContent("");
    }
  }, [urlId, navigate]);

  const handleSave = () => {
    const isUpdating = !!urlId;
    const url = isUpdating ? `${API_URL}/api/documents/${urlId}` : `${API_URL}/api/documents`;
    const method = isUpdating ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Id: urlId, Title: title, Content: content }),
    })
      .then((response) => {
        if (!response.ok && !isUpdating) {
          throw new Error("Failed to save document");
        }
        if (isUpdating) {
          alert("Document updated successfully!");
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("Document saved with ID:", data.id);
          alert(`Document saved! ID: ${data.id}`);
          navigate(`/editor/${data.id}`);
        }
      })
      .catch((error) => console.error("Error saving document:", error));
  };

  return (
    <div className="text-editor" style={{ height: "calc(100vh - 100px)", backgroundColor: "white" }}>
      <CustomToolbar onSave={handleSave} title={title} onTitleChange={(e) => setTitle(e.target.value)} />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={{ toolbar: { container: "#toolbar" } }}
        style={{ height: "100%" }}
      />
    </div>
  );
}

export default DocsEditor;
