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
import PaymentCancel from "@/pages/PaymentCancel";
import PaymentSuccess from "@/pages/PaymentSuccess";
import ChangePassword from "@/components/Auth/ChangePassword";
import ResetPassword from "@/pages/ResetPassword";
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
      {
        path: "/failed",
        element: <PaymentFailed />,
      },
      {
        path: "/cancel",
        element: <PaymentCancel/>,
      },
      {
        path: "/success",
        element : <PaymentSuccess/>
      },
      {
        path: "/changepassword",
        element : <ChangePassword/>
      },
      {
        path : "/resetpassword",
        element : <ResetPassword/>
      }
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
]);

export default appRoutes;
