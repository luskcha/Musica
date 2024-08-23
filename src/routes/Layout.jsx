import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import NavBar from "../components/navbar/NavBar";

export default function Layout(){
    return (
        <AuthProvider>
            <NavBar appName={"PONÉ PLAY"} />
            <div>
                <Outlet />
            </div>
        </AuthProvider>
    )
};