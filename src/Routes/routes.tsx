import App from "@/App";
import AuthComponent from "@/components/Auth/AuthComponent";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Index from "@/pages";
import NotFound from "@/pages/NotFound";
import UserDashboard from "@/pages/UserDashboard";
import { createBrowserRouter } from "react-router-dom";
// import Usermeal from "@/pages/user/usermeal"
// import MealCard from "@/components/Dashboard/MealCard";
// import BillCard from "@/components/Dashboard/BillCard";
import Billing from "@/components/Dashboard/Billing";
import Meals from "@/components/Dashboard/Meals"

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
    path: "/user-dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
      {
        path: "/user-dashboard/meals",
        element: <Meals />,
      },
      { path: "/user-dashboard/billing", element: <Billing /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default appRoutes;
