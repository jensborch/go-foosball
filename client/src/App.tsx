import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Theming from "./components/Theming";

function App() {
  return (
    <Theming>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </Theming>
  );
}

export default App;
