import Web3ContextProvider from './contexts/Web3Context'
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <Web3ContextProvider>
      <section>

    <Navbar/>
    <Dashboard/>
      </section>
    </Web3ContextProvider>
  );
}

export default App;
