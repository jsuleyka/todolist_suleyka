import { atom } from "recoil";

const sideMenu = atom({
  key: "sideMenu",
  default: {
    menu: [
      {
        icon: "Home",
        pathname: "/list",
        title: "Tareas",
      },
      {
        icon: "Trello",
        pathname: "/list/:taskId/tasks",
        title: "Subtareas",
        // ignore: true,
      },
    ],
  },
});

export { sideMenu };
