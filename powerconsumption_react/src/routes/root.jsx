import { Outlet } from "react-router-dom";
import SideBar from '../components/layout/sidebar';
import TopNavigation from '../components/layout/top_nav';


export default function Root() {
    // let menuIconButton = document.querySelector("[data-menu-icon-btn]")
    // let sidebar = document.querySelector("[data-sidebar]")

    // menuIconButton.addEventListener("click", () => {
    //     sidebar.classList.toggle("open")
    // })

    return (
        <>
            <TopNavigation />
            <div className="container-fluid">
                <SideBar />
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </>
    );
}