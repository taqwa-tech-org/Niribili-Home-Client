import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import appRoutes from "./Routes/routes.tsx";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "./Context/UserProvider.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <RouterProvider router={appRoutes} />
      </UserProvider>
    </TooltipProvider>
  </StrictMode>,
);
