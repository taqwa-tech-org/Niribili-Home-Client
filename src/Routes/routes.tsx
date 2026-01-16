import App from "@/App";
import AuthComponent from "@/components/Auth/AuthComponent";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Index from "@/pages";
import AdminDashboard from "@/pages/AdminDashboard/AdminDashboard";
import NotFound from "@/pages/NotFound";
import UserDashboard from "@/pages/UserDashboard";
import { createBrowserRouter } from "react-router-dom";


const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Index /> },
            {
                path: '/login',
                element: <AuthComponent />
            }
        ],
        
    },
    {
        path: "user-dashboard",
        element: <DashboardLayout role="user" />,
        children: [
            { index: true, element: <UserDashboard /> },
        ],
    },
    {
        path: "admin-dashboard",
        element: <DashboardLayout role='admin'/>,
        children: [
            { index: true, element: <AdminDashboard /> },
        ],
    },
    {
        path:'*',
        element: <NotFound />
    }
]);

export default appRoutes;