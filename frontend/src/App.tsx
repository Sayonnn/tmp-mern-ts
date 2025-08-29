import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [apiData, setApiData] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


  useEffect(() => {
    fetch(`${API_URL}/api`)
      .then((res) => res.json())
      .then((data) => setApiData(data))
      .catch(console.error);
  }, [API_URL]);
  

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <img src={viteLogo} alt="Vite Logo" className="logo" />
          <img src={reactLogo} alt="React Logo" className="logo react" />
        </div>
        <h1>Vite + React Demo</h1>
        <p className="subtitle">Professional-looking test page</p>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>Counter</h2>
          <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </button>
        </div>

        <div className="card api-card">
          <h2>API Response</h2>
          {apiData ? (
            <pre>{JSON.stringify(apiData, null, 2)}</pre>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>
          Learn more:{" "}
          <a href="https://vite.dev" target="_blank">
            Vite
          </a>{" "}
          &amp;{" "}
          <a href="https://react.dev" target="_blank">
            React
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
