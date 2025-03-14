import { TbMailExclamation, TbMailCheck, TbMailForward } from 'solid-icons/tb'
import { userState } from "../stores/pocketBase";
import { T } from "./translate";
import cx from "classnames"
import css from "./isverified.module.scss"
import { createSignal } from 'solid-js';
import { changeStyle, uuid } from '../../utils/Utils';

const emailId = "email" + uuid()
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

export const IsVerified = () => {
    const [email, setEmail] = createSignal({ email: "", isValid: false })
    const [emailSent, setEmailSent] = createSignal(false)

    return (
        <div class={cx("flex column gap-s", css.isVerified, userState().user?.verified ? css.true : css.false)}>
            {userState().user?.verified && <>
                <h4 class={"flex row center gap"}>
                    <T>Account verified</T>
                    <span class="flexGrow"></span>
                    <TbMailCheck size={22} color="hsla(var(--r-good), 1)" />
                </h4>
            </>}

            {!userState().user?.verified && <>
                <h4 class={"flex row center gap"}>
                    <T>Account unverified</T>
                    <span class="flexGrow"></span>
                    <TbMailExclamation size={22} color="hsla(var(--r-error), 1)" />
                </h4>
                <p data-translate>If you lose your password before verifying you'll be locked out of your account.</p>
                <form
                    oninput={(e) => {
                        setEmail({ ...email(), isValid: e.currentTarget.checkValidity() })
                    }}

                    onSubmit={(e) => { e.preventDefault() }}
                    class="form flex column gap-s">
                    <div class={"inputContainer"} >
                        <input
                            type="email"
                            pattern={`${emailRegex}`}
                            onInput={() => { setEmail({ ...email(), isValid: true }) }} id={emailId}
                            placeholder="email"
                            required
                        />
                        <label data-translate for={emailId}>Email</label>
                    </div>
                    <button
                        class="flex row center gap"
                        type="submit"

                        onClick={(e) => {
                            e.preventDefault()
                            changeStyle(e.currentTarget as HTMLElement, "bounceSVGright", 200)
                        }}


                    ><T>Send verification email</T><span class="flexGrow"></span><TbMailForward size={22} /></button>
                </form>
            </>}
        </div>
    )
}


