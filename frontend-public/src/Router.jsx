import { createBrowserRouter } from "react-router";
import Home from "./pages/Home.jsx";

export default createBrowserRouter([
    {
        path: "/:postId?",
        element: <Home />,
    }
])