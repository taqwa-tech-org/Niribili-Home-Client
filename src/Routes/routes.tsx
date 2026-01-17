import App from "@/App";
import AuthComponent from "@/components/Auth/AuthComponent";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Index from "@/pages";
import UserBilling from "@/pages/Billing";
import NotFound from "@/pages/NotFound";
import UserDashboard from "@/pages/UserDashboard";

import { createBrowserRouter } from "react-router-dom";
import Billing from "@/components/Dashboard/Billing";
import MealCard from "@/components/Dashboard/MealCard"
import UserProfileComponent from "@/components/Dashboard/UserProfileComponenet";
import Notification from "@/components/Dashboard/Notification"


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
      { path: "/user-dashboard/meals", element: <MealCard/> },
      { path: "/user-dashboard/billing", element: <UserBilling /> },
      { path: "/user-dashboard/profile", element: <UserProfileComponent/> },
      { path: "/user-dashboard/notifications", element: <Notification/> }

    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default appRoutes;
