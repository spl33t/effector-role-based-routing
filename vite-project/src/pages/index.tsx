import { router, routes } from "../shared/config/routing";
import { Route, RouterProvider } from "atomic-router-react";
import { HomePage } from "./home";
import { PostPage } from "./post";


export const Pages = () => {
  return (
    <RouterProvider router={router}>
      <Route route={routes.home.route} view={HomePage}/>
      <Route route={routes.post.route} view={PostPage}/>
    </RouterProvider>
  );
};