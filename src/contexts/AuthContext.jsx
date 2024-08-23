import { createContext, useReducer, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Contexto para las rutas protegidas
const AuthContext = createContext({
    state: {},
    actions: {},
});

const ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                token: action.payload || localStorage.getItem("authToken"),
                isAuthenticated: true,
            };
        case ACTIONS.LOGOUT:
            return {
                ...state,
                token: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
}

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        token: localStorage.getItem("authToken"),
        isAuthenticated: !!localStorage.getItem("authToken"), // True si hay un token almacenado
    });
    const navigate = useNavigate();
    const location = useLocation();

    const actions = {
        login: (token) => {
            localStorage.setItem("authToken", token);
            dispatch({ type: ACTIONS.LOGIN, payload: token });
            const origin = location.state?.from?.pathname || "/";
            navigate(origin);
        },
        logout: () => {
            localStorage.removeItem("authToken");
            dispatch({ type: ACTIONS.LOGOUT });
            navigate("/");
        },
    };

    return (
        <AuthContext.Provider value={{ state, actions }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(type) {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context[type];
}

export { AuthContext, AuthProvider, useAuth };
