import { changeStyle, uuid } from "../../utils/Utils";
import { AccountEmailChange } from "../components/accountemailchange";
import { T } from "../components/translate";
import { userState } from "../stores/pocketBase";
import css from "./profile.module.scss"
import cx from "classnames"
import { FaRegularChessKing, FaRegularChessPawn } from 'solid-icons/fa'

const ids = {
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
                    <p><T>Email</T>: {userState().email}</p>
                    {userState().isAdmin && <p class={"flex row center"}><T>Admin</T>: {userState().isAdmin ? <>Yes <FaRegularChessKing class={"marginLeft5"} color="hsla(var(--r-good), 1)" /></> : "No"}</p>}
                    <div class="flexGrow" />
                    <AccountEmailChange></AccountEmailChange>
                </div>

                <form class={cx("flex start center column gap-s form", css.card)}>
                    <input id={ids.name} type="text" placeholder="Name" />
                    <label data-translate for={ids.name}>Name</label>

                    <input id={ids.email} type="text" placeholder="Email" />
                    <label data-translate for={ids.email}>Email</label>

                    <input id={ids.phone} type="text" placeholder="Phone" />
                    <label data-translate for={ids.phone}>Phone</label>

                    <input id={ids.address} type="text" placeholder="Address" />
                    <label data-translate for={ids.address}>Address</label>

                    <input id={ids.city} type="text" placeholder="City" />
                    <label data-translate for={ids.city}>City</label>

                    <input id={ids.state} type="text" placeholder="State" />
                    <label data-translate for={ids.state}>State</label>

                    <input id={ids.zip} type="text" placeholder="Zip" />
                    <label data-translate for={ids.zip}>Zip</label>
                    
                    <input id={ids.zip} type="text" placeholder="Zip" />
                    {/* <label data-translate for={profileIds.zip}>Zip</label> */}

                    <button data-translate type="submit">Save</button>
                </form>
            </section>
        </div>

    )
}

export default Profile;