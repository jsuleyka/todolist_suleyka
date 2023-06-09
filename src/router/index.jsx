import { useRoutes } from "react-router-dom";
import Login from "../views/login/Main";
import SideMenu from "../layouts/side-menu/Main";
import SimpleMenu from "../layouts/simple-menu/Main";
import TopMenu from "../layouts/top-menu/Main";
import Page1 from "../views/page-1/Main";
import Page2 from "../views/page-2/Main";
import Home from "../views/home/Main";

function Router() {
  const routes = [
    {
      path: "/admin",
      element: <SideMenu />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "list",
          element: <Page1 />,
        },
        {
          path: "list/:taskId/tasks",
          element: <Page2 />,
        },
      ],
    },
    {
      path: "/simple-menu",
      element: <SimpleMenu />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "list",
          element: <Page1 />,
        },
        {
          path: "list/:taskId/tasks",
          element: <Page2 />,
        },
      ],
    },
    {
      path: "/top-menu",
      element: <TopMenu />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "list",
          element: <Page1 />,
        },
        {
          path: "list/:taskId/tasks",
          element: <Page2 />,
        },
      ],
    },
    {
      path: "/",
      element: <Login />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
