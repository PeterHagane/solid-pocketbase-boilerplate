import { TbMailCheck, TbMailQuestion } from 'solid-icons/tb'
import { userState } from "../stores/pocketBase";
import { T } from "./translate";
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { createSignal } from 'solid-js';
import { changeStyle, isValidEmailInput, uuid } from '../../utils/Utils';
import { requestEmailChange } from '../stores/pocketBase';
import Loader from './loader';
import { FiSave } from 'solid-icons/fi';

export const AccountChangeEmail = () => {
    const emailId = "email" + uuid()
    const [email, setEmail] = createSignal({ address: "", isValid: false })

    let emailRef: HTMLInputElement | undefined;

    return (
        <>
        {userState().user?.email === "" && <>
            {userState().isLoading && <Loader/>}

            <div class={cx("flex column gap-s", css.isVerified, userState().user?.verified ? css.true : css.false)}>
                <h4 class={"flex row center gap"}>
                    <T>Change your email</T>
                    <span class="flexGrow"></span>
                    <TbMailQuestion size={22} color="hsla(var(--r-error), 1)" />
                </h4>
                <T s p="." data-translate>Send an email change request</T>
                <form
                    
                    oninput={(e) => {
                        setEmail({ ...email(), isValid: isValidEmailInput(email().address, emailRef) })
                    }}
                    onSubmit={(e) => { e.preventDefault() }}
                    class="form flex column gap-s">
                    <div class={"inputContainer"} >
                        <input
                            ref={emailRef}
                            type="email"
                            onInput={(e) => { setEmail({ ...email(), address: e.target.value})}} 
                            id={emailId}
                            placeholder="email"
                            required
                        />
                        <label data-translate for={emailId}>Email</label>
                    </div>
                    <button
                        class="flex row center gap"
                        type="submit"
                        onClick={async (e) => {
                            e.preventDefault()
                            console.log(email().address)
                            // updateRecord("users", userState().user?.id, {email: email().address})
                            changeStyle(e.currentTarget as HTMLElement, "bounceSVGright", 200)
                        }}
                    ><T>Send request</T><span class="flexGrow"></span><FiSave size={22} /></button>
                </form>
            </div>
        </>}
        {userState().user?.email && <ChangeEmail />}
        </>
    )
}


const ChangeEmail = () => {
    const emailId = "email" + uuid()
    const [email, setEmail] = createSignal({ address: "", isValid: false })

    return (
        <>
        {userState().isLoading && <Loader/>}
        <div class={cx("flex column gap-s", css.isVerified, userState().user?.email ? css.true : css.false)}>
            {!userState().user?.verified && <>
                <h4 class={"flex row center gap"}>
                    {userState().user?.email === "" && <T>Change your email.</T>}
                    <span class="flexGrow"></span>
                    <TbMailCheck size={22} color="hsla(var(--r-error), 1)" />
                </h4>
                <p data-translate>Change your email.</p>
                <form
                    oninput={(e) => {
                        setEmail({ ...email(), isValid: e.currentTarget.checkValidity() })
                    }}

                    onSubmit={(e) => { e.preventDefault() }}
                    class="form flex column gap-s">
                    <div class={"inputContainer"} >
                        <input
                            type="email"
                            onInput={(e) => { setEmail({ ...email(), address: e.target.value})}} id={emailId}
                            placeholder="email"
                            required
                        />
                        <label data-translate for={emailId}>Email</label>
                    </div>
                    <button
                        class="flex row center gap"
                        type="submit"

                        onClick={async (e) => {
                            e.preventDefault()
                            await requestEmailChange(email().address)
                            changeStyle(e.currentTarget as HTMLElement, "bounceSVGright", 200)
                        }}


                    ><T>Send request</T><span class="flexGrow"></span><FiSave size={22} /></button>
                </form>
            </>}
        </div>
        </>
    )
}