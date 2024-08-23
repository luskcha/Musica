import NavMenu from "./NavMenu";
import { useAuth } from "../../contexts/AuthContext";
import "../navbar/NavBar.css";

function NavBar({ appName }) {

    const {login}= useAuth("actions");
    
    const handleClick= (e) => {
        login();
    };

    return (
        <header>
            <div className="header">
                <h1 className="title-main">{appName}</h1>
                <button className="button-logout" onClick={handleClick}>Cerrar sesion</button>       
            </div>
            <nav 
                className="navbar"
                role="navigation"
                aria-label="main-navigation"
            >
                <NavMenu
                    items={[
                        {text:"Home", url:"/home"},
                        {text:"Artist", url:"/artists"},                        
                        {text:"Albums", url:"/albums"},
                        {text:"Playlists", url:"playlists"},
                        {text:"Songs", url:"/songs"},
                        {text:"Genres", url:"/genres"},
                        {text:"Profile", url:"/profile"},
                    ]} 
                />
            </nav>
        </header>
    )
};

export default NavBar;