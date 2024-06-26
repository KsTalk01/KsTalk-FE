import ReactDOM from "react-dom/client";
import routes from "./router";
import "@arco-design/web-react/dist/css/arco.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";

// const router = createBrowserRouter(routes);

// 添加 basename 配置
const router = createBrowserRouter(routes, {
  basename: '/ksfe/',  // 这里设置 base path
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Suspense fallback={'loading...'}>
    <RouterProvider router={router} />
  </Suspense>
);
