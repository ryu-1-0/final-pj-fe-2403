import Login from "components/Login";
import UserCreate from "components/UserCreate";
import UserDetail from "components/UserDetail";
import UserList from "components/UserList";
import LayoutRoot from "components/common/LayoutRoot";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutRoot />,
    children: [
      {
        path: "/user-list",
        element: <UserList />,
      },
      {
        path: "user/:id",
        element: <UserDetail />,
      },
      {
        path: "user/create",
        element: <UserCreate />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;