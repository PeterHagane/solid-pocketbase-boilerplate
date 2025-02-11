import { createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { userState } from "../stores/pocketBase";

const ProtectedRoute = (props: any) => {
    const navigate = useNavigate();

    createEffect(() => {
    // const token = localStorage.getItem("token");
    const isLoggedIn = userState().pb?.authStore.isValid
    if (!isLoggedIn) {
            navigate("/login");
        }
    });

    

    return <>{props.children}</>;
};

export default ProtectedRoute;