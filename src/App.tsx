import { AppRouter } from "./AppRouter";
import { Providers } from "./shared/hooks/Providers";

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
