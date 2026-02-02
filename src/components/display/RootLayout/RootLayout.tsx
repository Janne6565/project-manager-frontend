import FloatingHeader from "@/components/display/FloatingHeader/FloatingHeader.tsx";
import type { ReactNode } from "react";
import AppNavBar from "@/components/display/AppNavBar/AppNavBar.tsx";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-background w-screen transition-colors min-h-screen flex flex-row">
      <AppNavBar />
      <div className={"flex flex-col grow"}>
        <FloatingHeader />
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
