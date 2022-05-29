import './App.css';
import Theming from './components/Theming';
import { QueryClient, QueryClientProvider } from 'react-query';
import Tournaments from './components/Tournaments';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theming>
        <Tournaments></Tournaments>
      </Theming>
    </QueryClientProvider>
  );
}

export default App;
