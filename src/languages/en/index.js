// Please add the imports in alphabetical order for ease of finding when things become large.
import application from "./application";
import auth from "./auth";
import classes from "./classes";
import couple from "./couple";
import cookies from "./cookies";
import form from "./form";
import general from "./general";
import locale from "./locale";
import navigation_drawer from "./navigation_drawer";
import networkErrors from "./network-errors";
import page_not_found from "./page_not_found";
import password_requirements from "./password_requirements";
import people from "./people";
import socket from "./socket";
import user from "./user";

const gb = {
  ...application,
  ...auth,
  ...classes,
  ...couple,
  ...cookies,
  ...form,
  ...general,
  ...locale,
  ...navigation_drawer,
  ...networkErrors,
  ...page_not_found,
  ...password_requirements,
  ...people,
  ...socket,
  ...user
};

export default gb;
