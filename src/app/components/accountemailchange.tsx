import { TbMailCheck, TbMailExclamation, TbMailQuestion } from 'solid-icons/tb'
import { RiBusinessMailSendLine } from 'solid-icons/ri'
import { authRefresh, sendEmailChangeRequest, subscribeUserChange, userState } from "../stores/pocketBase";
import { T } from "./translate";
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { createSignal } from 'solid-js';
import { changeStyle, setInputValidity, uuid } from '../../utils/Utils';
import Loader from './loader';
import { type } from "arktype"
import { UnsubscribeFunc } from 'pocketbase';

const checkEmailValidity = type({
     address: "string.email"
})

type TEmail = typeof checkEmailValidity.infer


export const AccountEmailChange = () => {
    const emailId = "email" + uuid()
    const [email, setEmail] = createSignal<TEmail>({ address: ""})

    let emailRef: HTMLInputElement | undefined;


    return (
        <>
            {userState().isLoading && <Loader/>}

            <div class={cx("flex column gap-s", css.isVerified,
                 userState().isPendingChange ? css.pending :
                 userState().user?.email !== "" ? css.true :
                 userState().user?.email === "" && css.false
                )}>
                
                <h4 class={"flex row center gap"}>
                {userState().isPendingChange ? <T>Email registration pending...</T> :
                userState().user?.email === "" ? <T>Register your email</T> :
                userState().user?.email !== "" && <T>Change your email</T>}
                    <span class="flexGrow"></span>
                    {userState().isPendingChange ? <TbMailQuestion size={22} color="hsla(var(--r-warning), 1)" /> :
                    userState().user?.email === "" ? <TbMailExclamation size={22} color="hsla(var(--r-error), 1)" /> :
                    userState().user?.email !== "" && <TbMailCheck size={22} color="hsla(var(--r-good), 1)" />}
                </h4>
                <span>

                {
                    userState().isPendingChange ? <>
                    <T s p=". " data-translate>A request has been sent</T>
                    <T s p=". " data-translate>Check your inbox</T>
                    </>:userState().user?.email !== "" ? <>
                    <T s p=". " data-translate>Your email is verified</T>
                    <T s p=". " data-translate>Send a request to change it</T>
                    </> : userState().user?.email === "" && <>
                    <T s p=". ">If you lose your password before registering an email address, you'll be locked out of your account</T>
                    <T s p=".">Your account functionality might also be limited</T>
                    </>
                }
                </span>
                <form
                    onSubmit={(e) => { e.preventDefault() }}
                    onInput={(e)=>{
                        const t = e.target as HTMLInputElement
                        const setting: string = t.getAttribute("data-key")!
                        setEmail((prev)=>{return{...prev, [setting]: t.value}})
                        setInputValidity(!!checkEmailValidity(email().address), emailRef)
                    }}

                    class="form flex column gap-s">
                        <input
                            ref={emailRef}
                            type="email"
                            id={emailId}
                            placeholder="email"
                            required
                            data-key={"address"}
                            data-validity
                        />
                        <label for={emailId} data-translate>Email</label>
                    <button
                        class="flex row center gap"
                        type="submit"
                        disabled={!checkEmailValidity(email().address)}
                        onClick={
                            async (e) => {
                                changeStyle(e.currentTarget as HTMLElement, "bounceSVGright", 200)
                                const r = await sendEmailChangeRequest(email().address)
                                let unsub: UnsubscribeFunc | undefined = undefined
                                if(r)unsub = await subscribeUserChange(authRefresh)
                                if(userState().user?.email && unsub)unsub()
                            }}>
                                <T>Send request</T>
                                <span class="flexGrow"></span><RiBusinessMailSendLine  size={20} />
                            </button>
                            
                </form>
            </div>
        </>
    )
}