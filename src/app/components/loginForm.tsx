import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { registerUser, signIn, userState } from "../stores/pocketBase";
import css from "./loginForm.module.scss"
import cx from "classnames";
import { Loader } from "./loader";
import { changeStyle, uuid } from "../../utils/Utils";
import { IoEnterOutline } from "solid-icons/io";

export const loginIds = {
    userName: "userName" + uuid(),
    password: "password" + uuid()
}


interface ILoginFormProps {
    class?: string
    title?: string
}

export interface ILoginForm {
    username: string
    password: string
    isValid?: boolean
}

const LoginForm = (_props: ILoginFormProps) => {
    const navigate = useNavigate();
    const [fields, setFields] = createSignal<ILoginForm>({ username: "", password: "", isValid: false })

    const handleSignIn = async (data: ILoginForm) => {
        signIn({ username: data.username, password: data.password }).then((didSignIn) => {
            didSignIn && navigate("/")
        })
    }

    const handleRegister = async (data: ILoginForm) => {
        registerUser({ username: data.username, password: data.password }).then(() => {
            navigate("/login")
        })
    }

    return <>
        <form oninput={(e) => {
            setFields({ ...fields(), isValid: e.currentTarget.checkValidity() })
        }}
            onSubmit={(e) => { e.preventDefault() }}
            class={cx("flex start center column gap-s form", css.container, _props.class)}>
            {userState().isLoading && <Loader></Loader>}
            {_props.title && <h2 data-translate>{_props.title}</h2>}
            <div class={cx("inputContainer", css.inputContainer)}>
                <input oninput={(e) => {
                    setFields({ ...fields(), username: e.target.value })
                }}
                    class={"indentShadow"} type="username" id={loginIds.userName} placeholder="username or email"
                    required autocomplete="on"
                    autofocus
                    minLength={3}
                ></input>
                <label for={loginIds.userName} data-translate>Username</label>
            </div>
            <div class={cx("inputContainer", css.inputContainer)}>
                <input oninput={(e) => {
                    setFields({ ...fields(), password: e.target.value })
                }}

                    class={"indentShadow flex center"} type="password" id={loginIds.password}
                    placeholder="password"
                    required
                    autocomplete="on"
                    minLength={8}
                ></input>
                <label for={loginIds.password} data-translate>Password</label>
            </div>
            <div class={cx("flex center gap-s disable", css.submitContainer)}>
                <button
                    id="loginFormSubmitButton"
                    type="submit"
                    data-translate
                    onClick={(e) => {
                        handleSignIn(fields())
                        changeStyle(e.currentTarget as HTMLElement, "bounceSVGright", 200)
                    }}

                    class={cx("submit flex center gap-s", css.submit)}
                    value="signin"
                    disabled={!fields().isValid}>
                    Login
                    {fields().isValid && <IoEnterOutline></IoEnterOutline>}
                </button>
                <button
                    id="register"
                    type="submit"
                    onClick={() => handleRegister(fields())}
                    value="newuser"
                    disabled={!fields().isValid} data-translate>Register user</button>
            </div>
        </form>
    </>;

};

export default LoginForm;