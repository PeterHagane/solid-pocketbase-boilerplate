import { TbMailCheck, TbMailExclamation, TbMailQuestion } from 'solid-icons/tb'
import { RiBusinessMailSendLine } from 'solid-icons/ri'
import { authRefresh, sendEmailChangeRequest, setUserState, subAndUnsubOnUserChange, userState } from "../stores/pocketBase";
import { T } from "./translate";
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { createSignal } from 'solid-js';
import { changeStyle, isValidEmailInput, uuid } from '../../utils/Utils';
import Loader from './loader';

export const AccountEmailChange = () => {
    const emailId = "email" + uuid()
    const [email, setEmail] = createSignal({ address: "", isValid: false })

    let emailRef: HTMLInputElement | undefined;


    return (
        <>
        
            {userState().isLoading && <Loader/>}

            <div class={cx("flex column gap-s", css.isVerified,
                 userState().isPendingChange ? css.pending :
                 userState().email !== "" ? css.true :
                 userState().email === "" && css.false
                )}>
                
                <h4 class={"flex row center gap"}>
                {userState().isPendingChange ? <T>Email registration pending...</T> :
                userState().email === "" ? <T>Register your email</T> :
                userState().email !== "" && <T>Change your email</T>}
                    <span class="flexGrow"></span>
                    {userState().isPendingChange ? <TbMailQuestion size={22} color="hsla(var(--r-warning), 1)" /> :
                    userState().email === "" ? <TbMailExclamation size={22} color="hsla(var(--r-error), 1)" /> :
                    userState().email !== "" && <TbMailCheck size={22} color="hsla(var(--r-good), 1)" />}
                </h4>
                <span>

                {
                    userState().isPendingChange ? <>
                    <T s p=". " data-translate>A request has been sent</T>
                    <T s p=". " data-translate>Check your inbox</T>
                    </>:userState().email !== "" ? <>
                    <T s p=". " data-translate>Your email is verified</T>
                    <T s p=". " data-translate>Send a request to change it</T>
                    </> : userState().email === "" && <>
                    <T s p=". ">If you lose your password before registering an email address, you'll be locked out of your account</T>
                    <T s p=".">Your account functionality might also be limited</T>
                    </>
                }
                </span>
                <form
                    oninput={() => {
                        setEmail({ ...email(), isValid: isValidEmailInput(email().address, emailRef) })
                    }}
                    onSubmit={(e) => { e.preventDefault() }}
                    class="form flex column gap-s">
                        <input
                            ref={emailRef}
                            type="email"
                            onInput={(e) => { setEmail({ ...email(), address: e.target.value})}} 
                            id={emailId}
                            placeholder="email"
                            required
                        />
                        <label data-translate for={emailId}>Email</label>
                    <button
                        class="flex row center gap"
                        type="submit"
                        onClick={
                            (e) => {
                                changeStyle(e.currentTarget as HTMLElement, "bounceSVGright", 200)
                                
                                sendEmailChangeRequest(email().address).then(
                                    ()=>{
                                        setUserState({
                                            ...userState(),
                                            isPendingChange: true,
                                            isLoading: false,
                                            isError: undefined,
                                        })
                                        subAndUnsubOnUserChange(authRefresh)
                                    }
                                )
                                
                            }}>
                                <T>Send request</T>
                                <span class="flexGrow"></span><RiBusinessMailSendLine  size={20} />
                            </button>
                </form>
            </div>
        </>
    )
}