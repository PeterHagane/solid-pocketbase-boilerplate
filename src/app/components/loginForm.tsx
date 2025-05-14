import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { pb, registerUser, setUserState, signIn, userState } from "../stores/pocketBase";
import css from "./loginForm.module.scss"
import cx from "classnames";
import { Loader } from "./loader";
import { changeStyle, delayStateChange, isValidEmail, uuid } from "../../utils/Utils";
import { IoEnterOutline } from "solid-icons/io";
import { notify } from "./notify";
import { t } from "../stores/translationStore";

export const loginIds = {
    userName: "userName" + uuid(),
    password: "password" + uuid(),
    registerButton: "register" + uuid(),
    loginButton: "login" + uuid(),
    forgotPasswordButton: "forgot" + uuid()
}


interface ILoginFormProps {
    class?: string
    title?: string
}

export interface ILoginForm {
    email?: string
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
        registerUser({ email: isValidEmail(data.username) ? data.username : "", username: !isValidEmail(data.username) ? data.username : "", password: data.password }).then(() => {
            navigate("/login")
        })
    }

    let usernameRef: HTMLInputElement | undefined;
    let passwordRef: HTMLInputElement | undefined;

    return <>
        <form oninput={(e) => {setFields({ ...fields(), isValid: e.currentTarget.checkValidity() })}}
            onSubmit={(e) => { e.preventDefault() }}
            class={cx("flex start center column gap-s form", css.container, _props.class)}>
            
            {userState().isLoading && <Loader></Loader>}
                        {_props.title && <h2 data-translate>{_props.title}</h2>}
            <input oninput={(e) => {
                setFields({ ...fields(), username: e.target.value })
            }}
                ref={usernameRef}
                class={"indentShadow input"}
                type="username"
                id={loginIds.userName}
                placeholder="username or email"
                required autocomplete="on"
                autofocus
                minLength={3}
                data-validity
            ></input>
            <label for={loginIds.userName} data-translate>Username or email</label>

            <input oninput={(e) => {
                setFields({ ...fields(), password: e.target.value })
            }}
                ref={passwordRef}
                class={"indentShadow input"} 
                type="password"
                id={loginIds.password}
                placeholder="password"
                required
                autocomplete="on"
                minLength={8}
                data-validity
            ></input>
            <label for={loginIds.password} data-translate>Password</label>
            <div class={cx("flex alignItemsCenter gap-s", css.submitContainer)}>
                <button
                    id={loginIds.loginButton}
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
                    <Show when={fields().isValid}>
                        <IoEnterOutline></IoEnterOutline>
                    </Show>
                    {/* {fields().isValid && <IoEnterOutline></IoEnterOutline>} */}
                </button>
                <button
                    id={loginIds.registerButton}
                    onClick={() => handleRegister(fields())}
                    value="newuser"
                    type="submit"
                    disabled={!fields().isValid} 
                    data-translate>Register user</button>
                <button
                    class={css.forgot}
                    id={loginIds.forgotPasswordButton}
                    onClick={async()=>{
                        const v = isValidEmail(usernameRef?.value || "")
                        if(usernameRef && !v){
                            usernameRef.setCustomValidity("Please enter a valid email.")
                            delayStateChange(()=> usernameRef.setCustomValidity(""), 2000)
                        }
                        if(passwordRef){
                            passwordRef.value = ""
                            passwordRef.setCustomValidity(" ")
                            delayStateChange(()=> passwordRef.setCustomValidity(""), 2000)
                        }

                        if(v){
                            setUserState(prev => {return {...prev, isLoading: true}})
                            await pb.collection('users').requestPasswordReset(fields().username).then(
                            ()=>{
                                setUserState(prev => {return {...prev, isLoading: false}}
                                )
                                notify(t("Password reset request sent to") + " " + usernameRef?.value)
                            }
                        ).catch(
                            (e)=>{
                                setUserState(prev => {return {...prev, isLoading: false}})
                                notify(t(e))
                            }
                        );}
                    }}
                    value="forgot"
                    data-translate>Forgot password?</button>
            </div>
        </form>
    </>;

};

export default LoginForm;