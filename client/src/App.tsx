import './App.css';
import Theming from './components/Theming';
import { QueryClient, QueryClientProvider } from 'react-query';
import Tournaments from './components/Tournaments';
import Menu from './components/Menu';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theming>
        <Menu title="Foosball" children={undefined}></Menu>
        <Tournaments></Tournaments>
      </Theming>
    </QueryClientProvider>
  );
}

export default App;
