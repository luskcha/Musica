import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import NavBar from "../components/navbar/NavBar";

export default function Layout(){
    return (
        <AuthProvider>
            <NavBar appName={"MUSICA"} />
            <div>
                <Outlet />
            </div>
        </AuthProvider>
    )
};