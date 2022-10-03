import "./App.css";
import Theming from "./components/Theming";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import React from "react";
import Tournament from "./pages/Tournament";
import { CssBaseline } from "@mui/material";

const queryClient = new QueryClient();
function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <CssBaseline>
          <Theming>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tournament/:id" element={<Tournament />} />
              </Routes>
            </HashRouter>
          </Theming>
        </CssBaseline>
        '
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
