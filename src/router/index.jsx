import { useRoutes } from "react-router-dom";
import Login from "../views/login/Main";
import SideMenu from "../layouts/side-menu/Main";
import SimpleMenu from "../layouts/simple-menu/Main";
import TopMenu from "../layouts/top-menu/Main";
import Page1 from "../views/page-1/Main";
import Page2 from "../views/page-2/Main";

function Router() {
  const routes = [
    {
      path: "/",
      element: <SideMenu />,
      children: [
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
      path: "/login",
      element: <Login />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
