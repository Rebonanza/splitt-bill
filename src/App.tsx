import { BillProvider } from '@/context/BillContext';
import Home from '@/pages/Home';

function App() {
  return (
    <BillProvider>
      <Home />
    </BillProvider>
  );
}

export default App;
