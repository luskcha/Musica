import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

export default function LayoutSinNav(){
    return (
        <AuthProvider>
            <div>
                <Outlet />
            </div>
        </AuthProvider>
    )
}