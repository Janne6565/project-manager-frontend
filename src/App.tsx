import { ThemeProvider } from "@/components/technical/theme-provider.tsx";
import ProjectsProvider from "@/components/technical/projects-provider.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen.ts";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider>
          <ProjectsProvider>
            <RouterProvider router={router} />
          </ProjectsProvider>
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
