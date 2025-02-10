import { Route, Routes } from "react-router-dom";
import { RouterType } from "types";
import { Suspense } from "react";
import { LoadingSpinner } from "components/LoadingSpinner";

function Router({ pages }: { pages: RouterType[] }) {
  const pageRoutes = pages.map(({ path, title, element }: RouterType) => {
    return <Route key={title} path={`/${path}`} element={element} />;
  });

  return <Suspense fallback={<LoadingSpinner />}>
    <Routes>{pageRoutes}</Routes>;
  </Suspense>
}

export default Router;
