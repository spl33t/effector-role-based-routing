import { router, routes } from "../shared/config/routing";
import { Route, RouterProvider } from "atomic-router-react";
import { HomePage } from "./home";
import { PostsPage } from "./posts";
import { Header } from "../widgets/header/view";
import { AuthPage } from "./auth";


export const Pages = () => {
  return <>
    <RouterProvider router={router}>
      <Header/>
      <Route route={routes.home.route} view={HomePage}/>
      <Route route={routes.posts.route} view={PostsPage}/>
      <Route route={routes.auth.route} view={AuthPage}/>
    </RouterProvider>
  </>
};