import { Outlet, createRootRoute } from "@tanstack/react-router";
import RootLayout from "@/components/display/RootLayout/RootLayout.tsx";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
