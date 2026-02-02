import { ThemeProvider } from "@/components/technical/theme-provider.tsx";
import AuthProvider from "@/components/technical/auth-provider.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen.ts";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

export function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <SidebarProvider>
              <RouterProvider router={router} />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
