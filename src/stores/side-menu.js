import { atom } from "recoil";

const sideMenu = atom({
  key: "sideMenu",
  default: {
    menu: [
      {
        icon: "Trello",
        pathname: "/admin/list",
        title: "Tareas",
      },
      // {
      //   icon: "Trello",
      //   pathname: "/admin/list/:taskId/tasks",
      //   title: "Subtareas",
      //   // ignore: true,
      // },
    ],
  },
});

export { sideMenu };
