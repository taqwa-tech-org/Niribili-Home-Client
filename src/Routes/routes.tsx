import App from "@/App";

import DashboardLayout from "@/Layouts/DashboardLayout";
import Index from "@/pages";
import UserBilling from "@/components/Dashboard/UserBilling";
import NotFound from "@/pages/NotFound";
import UserDashboard from "@/pages/UserDashboard";
import { createBrowserRouter, Link } from "react-router-dom";
import MealCard from "@/components/Dashboard/MealCard";
import UserProfileComponent from "@/components/Dashboard/UserProfileComponent";
// import { userProfileLoader } from "@/Loader/userProfile.loader";
import PrivateRoute from "@/PrivateRoutes/PrivateRoute";
import AddMoneyWithBalance from "@/components/Dashboard/AddMoneyWithBalance";
import PaymentFailed from "@/pages/PaymentFailed";
import Login from "@/components/Auth/Login";
import Register from "@/components/Auth/Register";

const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Index /> },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "user-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,

        element: (
          <PrivateRoute>
            <UserDashboard />,
          </PrivateRoute>
        ),
      },
      {
        path: "/user-dashboard/meals",
        element: (
          <PrivateRoute>
            <MealCard />
          </PrivateRoute>
        ),
      },
      {
        path: "/user-dashboard/billing",
        element: (
          <PrivateRoute>
            <UserBilling />
          </PrivateRoute>
        ),
      },

      {
        path: "/user-dashboard/profile",
        element: <UserProfileComponent />,
      },
      {
        path: "/user-dashboard/addmoney",
        element: <AddMoneyWithBalance />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/cancel",
    element: <PaymentFailed />,
  },
]);

export default appRoutes;
