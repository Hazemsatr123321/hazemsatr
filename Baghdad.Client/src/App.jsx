import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5117/api/status")
      .then((response) => response.json())
      .then((data) => setMessage(data.Message))
      .catch((error) => console.error("Error fetching status:", error));
  }, []);

  return (
    <>
      <h1>Baghdad</h1>
      <p>Status from backend: {message || "Loading..."}</p>
    </>
  );
}

export default App;
