import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";
import imagen from "../../assets/undraw_cat_epte.svg";
import "../profile/Profile.css";

// Componente que genera el Perfil del Usuario.
function Profile() {
    const {token} = useAuth("state");
    const [editMode, setEditMode] = useState(false);
    const [dataUser, setDataUser] = useState({
        user__id: "",
        first_name: "",
        last_name: "",
        email: "",
        bio: "",
        image: "",
        username: ""
    });
    const [mensajeExito, setMensajeExito] = useState(false);
    const [ idUser, setIdUser]= useState("");

    //Trae los datos del usuario logueado.
    const [{data, isError, isLoading}, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/profiles/profile_data/`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    )

    useEffect(()=>{
        doFetch();
    }, []);

    useEffect(()=>{
        if(data){
            setDataUser(data);
            setIdUser(data.user__id);
        }
    }, [data]);

    function handleEditClic (){
        setEditMode(!editMode);
    };
    
    //Guarda los datos si es que se editaron
    const handleGuardar= async ()=> { fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/profiles/${data.user__id}/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                first_name: dataUser.first_name,
                last_name: dataUser.last_name,
                email: dataUser.email,
                bio: dataUser.bio
            }),
        })
            .then((response)=>{
                if(!response.ok){
                    throw new Error("No se pudo actualizar el usuario.")
                }
                return response.json();
            })
            .then((data)=> {
                if(data){
                    setDataUser(data);
                }
            })
            .catch(()=> {
                console.error("error al actualizar");  
            })

        // cirra el editMode
        setEditMode(false);

        //muestra mensaje
        setMensajeExito(true);

        setTimeout(()=> {
            setMensajeExito(false);
        }, 3000);
    };
    
    const handleCambios= (e) =>{
        setDataUser({
            ...dataUser,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(event){
        event.preventDefault();
    }

    //Verifica si hay carga o error
    if(isLoading) return <p>Cargando...</p>;
    if(isError) return <p>Error al cargar los datos</p>;

    return (
        <div className="card">
            { data? (
                <>
                    <div className="content-card">
                        <div>
                            <div className="content-figura"> 
                                <figure className="circular-form">
                                    <img 
                                        src={data.image || 
                                            imagen
                                        } 
                                        alt="Profile image"
                                    />
                                </figure>
                            </div>
                            <div className="userName">
                                <p>{dataUser.username}</p>
                            </div>
                        </div>
                        <div>
                            <form className="content" onSubmit={handleSubmit}>
                                <div className="content-datos">
                                    <p className="lable">Nombre</p>
                                    {editMode? (
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={dataUser.first_name}
                                            onChange={handleCambios}
                                        />
                                        ):(<p className="data">{dataUser.first_name}</p>)}                                
                                    <p className="lable">Apellido</p>
                                    {editMode? (
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={dataUser.last_name}
                                            onChange={handleCambios}
                                        />
                                    ):(<p className="data">{dataUser.last_name}</p>)}
                                    <br />
                                    <p className="lable">Email:</p>
                                    {editMode? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={dataUser.email}
                                            onChange={handleCambios}
                                        />
                                        ):(<p className="data">{dataUser.email}</p>)}
                                    <br />
                                    <div className="content-bio">
                                        <p className="lable">Bio:</p>
                                        {editMode ? (
                                            <textarea
                                                name="bio"
                                                value={dataUser.bio}
                                                onChange={handleCambios}
                                            />
                                            ): (<p className="data">{dataUser.bio}</p>)}
                                    </div>
                                    <br />
                                    <br />
                                    <button
                                        className="button-edit"
                                        onClick={handleEditClic}
                                    >
                                        {!editMode ? "Editar" : "Salir"}
                                    </button>
                                    {editMode? (
                                        <button
                                            className="button-edit"
                                            onClick={handleGuardar}
                                        >
                                            Guardar
                                        </button>
                                    ):("")}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div>
                        {mensajeExito && (
                            <p className="success-message">Datos guardados con exitos</p>
                        )}
                    </div>
                </>
            ):(<p className="data">No se encontraron datos del usuario.</p>)}
        </div>
    );
};

export default Profile;