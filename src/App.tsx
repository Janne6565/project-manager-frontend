import RootPage from '@/components/display/RootPage/RootPage.tsx';
import { ThemeProvider } from '@/components/technical/theme-provider.tsx';
import ProjectsProvider from '@/components/technical/projects-provider.tsx';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ProjectsProvider>
          <RootPage />
        </ProjectsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
