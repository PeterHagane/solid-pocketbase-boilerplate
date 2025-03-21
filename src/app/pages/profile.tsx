import { changeStyle, uuid } from "../../utils/Utils";
import { AccountChangeEmail } from "../components/accountchangeemail";
import { AccountIsVerified } from "../components/accountisverified";
import { Disable } from "../components/layout/disable";
import { T } from "../components/translate";
import { userState } from "../stores/pocketBase";
import css from "./profile.module.scss"
import cx from "classnames"
import { FaRegularChessKing, FaRegularChessPawn } from 'solid-icons/fa'

const profileIds = {
    name: "name" + uuid(),
    email: "email" + uuid(),
    phone: "phone" + uuid(),
    address: "address" + uuid(),
    city: "city" + uuid(),
    state: "state" + uuid(),
    zip: "zip" + uuid(),
}


export const Profile = () => {

    

    return (
        <div
            on:load={(e) => {
                changeStyle(e.currentTarget as HTMLElement, "fadeInUp", 200)
            }}

            class={cx("flex column", css.profile)}>
            <div class={css.title}>
                <h1 data-translate>User profile</h1>

                {userState().user && <h3 class={"flex row center wrap gap"}><T p={":"}>Signed in as</T> <span class={"flex row center"}>
                    {userState().user?.username}
                    {userState().isAdmin && <FaRegularChessKing class={"marginLeft5"} color="hsla(var(--r-good), 1)" />}
                    {!userState().isAdmin && <FaRegularChessPawn class={"marginLeft5"} color="hsla(var(--r-primary), 0.7)" />}
                </span></h3>}
            </div>



            <section class={cx("", css.section)}>
                <div class={cx("flex column shadow rounding", css.card, css.summary)}>
                    <h2 data-translate>Summary</h2>
                    <p><T>Name</T>: {userState().user?.username}</p>
                    <p><T>Email</T>: {userState().user?.email}</p>
                    {userState().isAdmin && <p class={"flex row center"}><T>Admin</T>: {userState().isAdmin ? <>Yes <FaRegularChessKing class={"marginLeft5"} color="hsla(var(--r-good), 1)" /></> : "No"}</p>}
                    <div class="flexGrow" />

                    <AccountChangeEmail></AccountChangeEmail>
                    <Disable disabled={false}><AccountIsVerified /></Disable>
                    {/* {userState().user?.email && <IsVerified />} */}

                    {/* <p><T>Phone</T>: {userState().user?.phone}</p>
                    <p><T>Address</T>: {userState().user?.address}</p>
                    <p><T>City</T>: {userState().user?.city}</p>

                    <p><T>State</T>: {userState().user?.state}</p> */}
                </div>

                <form class={cx("flex start center column gap-s form", css.card)}>
                    <div class={cx("inputContainer", css.inputContainer)}>
                        <input id={profileIds.name} type="text" placeholder="Name" />
                        <label data-translate for={profileIds.name}>Name</label>
                    </div>
                    <div class={cx("inputContainer", css.inputContainer)}>

                        <input id={profileIds.email} type="text" placeholder="Email" />
                        <label data-translate for={profileIds.email}>Email</label>
                    </div>
                    <div class={cx("inputContainer", css.inputContainer)}>

                        <input id={profileIds.phone} type="text" placeholder="Phone" />
                        <label data-translate for={profileIds.phone}>Phone</label>
                    </div>
                    <div class={cx("inputContainer", css.inputContainer)}>
                        <input id={profileIds.address} type="text" placeholder="Address" />
                        <label data-translate for={profileIds.address}>Address</label>
                    </div>

                    <div class={cx("inputContainer", css.inputContainer)}>

                        <input id={profileIds.city} type="text" placeholder="City" />
                        <label data-translate for={profileIds.city}>City</label>
                    </div>
                    <div class={cx("inputContainer", css.inputContainer)}>

                        <input id={profileIds.state} type="text" placeholder="State" />
                        <label data-translate for={profileIds.state}>State</label>
                    </div>
                    <div class={cx("inputContainer", css.inputContainer)}>

                        <input id={profileIds.zip} type="text" placeholder="Zip" />
                        <label data-translate for={profileIds.zip}>Zip</label>
                    </div>

                    <button data-translate type="submit">Save</button>
                </form>



            </section>



        </div>

    )
}

export default Profile;