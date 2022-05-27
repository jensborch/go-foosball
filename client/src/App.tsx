import "./App.css";
import Theming from "./components/Theming";
import { QueryClient, QueryClientProvider } from "react-query";
import Tournaments from "./components/Tournaments";

const queryClient = new QueryClient();
function App() {
  return (
    <Theming>
      <QueryClientProvider client={queryClient}>
        <Tournaments></Tournaments>
      </QueryClientProvider>
    </Theming>
  );
}

export default App;
