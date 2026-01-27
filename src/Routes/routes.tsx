import App from "@/App";
import AuthComponent from "@/components/Auth/AuthComponent";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Index from "@/pages";
import UserBilling from "@/pages/UserBilling";
import NotFound from "@/pages/NotFound";
import UserDashboard from "@/pages/UserDashboard";
import { createBrowserRouter, Link } from "react-router-dom";
import MealCard from "@/components/Dashboard/MealCard";
import UserProfileComponent from "@/components/Dashboard/UserProfileComponent";
// import { userProfileLoader } from "@/Loader/userProfile.loader";
import PrivateRoute from "@/PrivateRoutes/PrivateRoute";
import AddMoneyWithBalance from "@/components/Dashboard/AddMoneyWithBalance";
import PaymentFailed from "@/pages/PaymentFailed";




const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
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
        element: <AddMoneyWithBalance/>
      }
      

      
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
  {
        path: "/cancel",  element: <PaymentFailed/>
      }
]);

export default appRoutes;
