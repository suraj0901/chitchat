import { ModeToggle } from "@/components/mode-toggle.tsx";
import PWABadge from "./PWABadge.tsx";

function App() {
  return (
    <div className="container mx-auto">
      <header className="flex items-center justify-between p-4">
        <h1 className="font-semibold text-2xl uppercase tracking-wider">
          ChitChat
        </h1>
        <ModeToggle />
      </header>
      <PWABadge />
    </div>
  );
}

export default App;
