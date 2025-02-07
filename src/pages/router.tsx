import { Route, Routes } from "react-router-dom";
import { routerType } from "../utilities";
import { RouterType } from "types";

function Router({ pages }: {pages: RouterType[]}) {
  const pageRoutes = pages.map(({ path, title, element }: routerType) => {
    return <Route key={title} path={`/${path}`} element={element} />;
  });

  return <Routes>{pageRoutes}</Routes>;
}

export default Router;
