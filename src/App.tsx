import RootPage from "@/components/display/RootPage/RootPage.tsx";
import {ThemeProvider} from "@/components/technical/theme-provider.tsx";

export function App() {
    return <ThemeProvider>
        <RootPage/>
    </ThemeProvider>;
}

export default App;