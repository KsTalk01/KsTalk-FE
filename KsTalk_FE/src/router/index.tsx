import { lazy } from "react";
import { RouteObject } from "react-router-dom";

//路由统一引入
const App = lazy(() => import("../App"));
const Login = lazy(() => import("@/components/Login"));
const Regist = lazy(() => import("@/components/Regist"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/regist",
    element: <Regist />,
  }
];

export default routes;
