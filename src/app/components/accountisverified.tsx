import {  TbMailForward } from 'solid-icons/tb'
import { requestEmailChange, userState } from "../stores/pocketBase";
import { T } from "./translate";
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { changeStyle, uuid } from '../../utils/Utils';
import { verifyUser } from '../stores/pocketBase';
import Loader from './loader';
import { FiUserCheck, FiUserX } from 'solid-icons/fi';
import { createSignal } from 'solid-js';

export const AccountIsVerified = () => {
    const emailId = "email" + uuid()
    const [email, setEmail] = createSignal({ address: "", isValid: false })

    return (
        <>
        {userState().isLoading && <Loader/>}
        <div class={cx("flex column gap-s", css.isVerified, userState().user?.verified ? css.true : css.false)}>
            {userState().user?.verified && <>
                <h4 class={"flex row center gap"}>
                    <T>Account verified</T>
                    <span class="flexGrow"></span>
                    <FiUserCheck size={22} color="hsla(var(--r-good), 1)" />
                </h4>
            </>}

            {!userState().user?.verified && <>
                <h4 class={"flex row center gap"}>
                    <T>Account unverified</T>
                    <span class="flexGrow"></span>
                    <FiUserX size={22} color="hsla(var(--r-error), 1)" />
                </h4>
                <T s p=".">If you lose your password before registering an email address, you'll be locked out of your account</T>
                <T s p=".">Your account functionality might also be limited</T>
                {/* <button
                        class="flex row center gap"
                        type="submit"

                        onClick={async (e) => {
                            e.preventDefault()
                            verifyUser(userState().user?.email)
                            changeStyle(e.currentTarget as HTMLElement, "bounceSVGright", 200)
                        }}


                    ><T>Send verification email</T><span class="flexGrow"></span><TbMailForward size={22} /></button> */}

                <form
                    oninput={(e) => {
                        setEmail({ ...email(), isValid: e.currentTarget.checkValidity() })
                    }}

                    onSubmit={(e) => { e.preventDefault() }}
                    class="form flex column gap-s">

                        <input
                            type="email"
                            onInput={(e) => { setEmail({ ...email(), address: e.target.value})}} id={emailId}
                            placeholder="email"
                            required
                        />
                        <label data-translate for={emailId}>Email</label>

                    <button
                        class="flex row center gap"
                        type="submit"

                        onClick={async (e) => {
                            e.preventDefault()
                            const r = await requestEmailChange(email().address)
                            if(r === true)verifyUser(email().address)
                            changeStyle(e.currentTarget as HTMLElement, "bounceSVGright", 200)
                        }}


                    ><T>Send verification email</T><span class="flexGrow"></span><TbMailForward size={22} /></button>
                </form>
            </>}
        </div>
        </>
    )
}


