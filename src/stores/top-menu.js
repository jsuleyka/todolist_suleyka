import { atom } from "recoil";

const topMenu = atom({
  key: "topMenu",
  default: {
    menu: [
      {
        icon: "Home",
        pathname: "/top-menu/list",
        title: "Tareas",
      },
      // {
      //   icon: "Trello",
      //   pathname: "/top-menu/list/:taskId/tasks",
      //   title: "Subtareas",
      // },
    ],
  },
});

export { topMenu };
