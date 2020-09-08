const Style = () => import("../../pages/debug/Style");
const Socket = () => import("../../pages/debug/Socket");

const debugRoutes = [
  {
    path: "/style",
    component: Style,
    name: "style",
    meta: {
      debug: true
    }
  },
  {
    path: "/socket",
    name: "socket",
    component: Socket,
    meta: {
      debug: true
    }
  }
];
export default debugRoutes;
