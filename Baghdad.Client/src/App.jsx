import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import DocsEditor from "./components/DocsEditor";
import DocumentListPage from "./pages/DocumentListPage";
import SheetEditor from "./pages/SheetEditor";
import SheetListPage from "./pages/SheetListPage";
import ChartOfAccountsPage from "./pages/ChartOfAccountsPage";

function App() {
  return (
    <div>
      <nav style={{ padding: "10px", borderBottom: "1px solid #444", textAlign: "left" }}>
        <Link to="/">Documents</Link> | <Link to="/sheets">Sheets</Link> | <Link to="/accounting">Accounting</Link>
      </nav>
      <main style={{ padding: "10px" }}>
        <Routes>
          {/* Document Routes */}
          <Route path="/" element={<DocumentListPage />} />
          <Route path="/editor" element={<DocsEditor />} />
          <Route path="/editor/:id" element={<DocsEditor />} />

          {/* Sheet Routes */}
          <Route path="/sheets" element={<SheetListPage />} />
          <Route path="/sheets/new" element={<SheetEditor />} />
          <Route path="/sheets/:id" element={<SheetEditor />} />

          {/* Accounting Routes */}
          <Route path="/accounting" element={<ChartOfAccountsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
