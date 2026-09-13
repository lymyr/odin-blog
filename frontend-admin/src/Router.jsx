import { createBrowserRouter } from "react-router";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";

export default createBrowserRouter([
    {
        path: "/",
        element: <Admin />
    },
    {
        path: "/login",
        element: <Login />
    }
])