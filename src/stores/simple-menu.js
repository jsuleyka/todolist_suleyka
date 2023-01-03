import { atom } from "recoil";

const simpleMenu = atom({
  key: "simpleMenu",
  default: {
    menu: [
      {
        icon: "Home",
        pathname: "/simple-menu/list",
        title: "Tareas",
      },
      // {
      //   icon: "Home",
      //   pathname: "/simple-menu/list/:taskId/tasks",
      //   title: "Subtareas",
      // },
    ],
  },
});

export { simpleMenu };
