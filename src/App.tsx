import { Toaster } from "sonner";
import Wordle from "./pages/home";

function App() {
  return (
    <div className="h-screen bg-gray-800 font-mono">
      <Toaster position="top-right" />
      <Wordle />
    </div>
  );
}

export default App;
