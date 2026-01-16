import App from "@/App";
import AuthComponent from "@/components/Auth/AuthComponent";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Index from "@/pages";
import UserBilling from "@/pages/Billing";
import NotFound from "@/pages/NotFound";
import UserDashboard from "@/pages/UserDashboard";
import UserMeals from "@/pages/UserMeals";
import { createBrowserRouter } from "react-router-dom";

const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Index /> },
      {
        path: "/login",
        element: <AuthComponent />,
      },
    ],
  },
  {
    path: "user-dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "/user-dashboard/meals", element: <UserMeals /> },
      { path: "/user-dashboard/billing", element: <UserBilling /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default appRoutes;
