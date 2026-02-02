import { Outlet, createRootRoute } from "@tanstack/react-router";
import RootLayout from "@/components/display/RootLayout/RootLayout.tsx";
import { DataFetcher } from "@/components/technical/data-fetcher";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootLayout>
      <DataFetcher />
      <Outlet />
    </RootLayout>
  );
}
