const Profile = () => import("../../pages/user/Profile");
const Security = () => import("../../pages/user/Security");
const Dashboard = () => import("../../pages/user/Dashboard");
const Classes = () => import("../../pages/user/Classes");
const DancingClass = () => import("../../pages/user/DancingClass");
const People = () => import("../../pages/user/People");
const Couple = () => import("../../pages/user/Couple");

const userRoutes = [
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      auth: true
    }
  },
  {
    path: "/security",
    name: "security",
    component: Security,
    meta: {
      auth: true
    }
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      auth: true
    }
  },
  {
    path: "/classes",
    name: "classes",
    component: Classes,
    meta: {
      auth: true
    }
  },
  {
    path: "/class/:id",
    name: "class",
    component: DancingClass,
    meta: {
      auth: true
    }
  },
  {
    path: "/people",
    name: "people",
    component: People,
    meta: {
      auth: true
    }
  },
  {
    path: "/couple",
    name: "couple",
    component: Couple,
    meta: {
      auth: true
    }
  }
];

export default userRoutes;
