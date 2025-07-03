import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/Profile.jsx";
import Favorites from "./pages/Favorites.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
  { path: "", element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "books/:id", element: <PrivateRoute><BookDetails /></PrivateRoute> },
  { path: "profile", element: <PrivateRoute><Profile /></PrivateRoute> },
  { path: "favorites", element: <PrivateRoute><Favorites /></PrivateRoute> }
  ]
  }
]);

export default router;
