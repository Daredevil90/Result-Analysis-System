import Header from "./ui/Header.jsx";
import { Outlet } from "react-router-dom";
export default function Layout(){
    return(
        <>
        <Header/>
        <Outlet/>
        </>
    )
}