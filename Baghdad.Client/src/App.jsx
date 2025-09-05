import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import DocsEditor from "./components/DocsEditor";
import DocumentListPage from "./pages/DocumentListPage";

function App() {
  return (
    <div>
      <nav style={{ padding: "10px", borderBottom: "1px solid #444", textAlign: "left" }}>
        <Link to="/">Home</Link> | <Link to="/editor">New Document</Link>
      </nav>
      <main style={{ padding: "10px" }}>
        <Routes>
          <Route path="/" element={<DocumentListPage />} />
          <Route path="/editor" element={<DocsEditor />} />
          <Route path="/editor/:id" element={<DocsEditor />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
