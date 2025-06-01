import "./App.css";
import Theming from "./components/Theming";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import React from "react";
import Tournament from "./pages/Tournament";
import { CssBaseline } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

type AppProps = {
  basename: string;
};
function App({ basename }: AppProps) {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <CssBaseline>
            <Theming>
              <BrowserRouter basename={basename}>
                <Routes>
                  <Route index element={<Index />} />
                  <Route path="/tournament/:id" element={<Tournament />} />
                </Routes>
              </BrowserRouter>
            </Theming>
          </CssBaseline>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
