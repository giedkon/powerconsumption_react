import { useRouteError } from "react-router-dom";
import SideBar from "../components/layout/sidebar";
import TopNavigation from "../components/layout/top_nav";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <TopNavigation />
      <div className="container-fluid">
        <SideBar />
        <main className="content">
          <h1 className="display-1 fw-bolder">404</h1>
          <div className="lead">Page does not exist or has not been implemented yet</div>
        </main>
      </div>
    </>
  );
}
