import { Component} from "solid-js";
import { AccountSettings } from "../components/accountsettings";
import { T } from "../components/translate";
import { userState } from "../stores/pocketBase";
import css from "./profile.module.scss"
import cx from "classnames"
import { FaRegularChessKing, FaRegularChessPawn } from 'solid-icons/fa'
import { t } from "../stores/translationStore";
import { AccountEmailChange } from "../components/accountemailchange";
import Avatar from "../components/avatar";




export const Profile: Component = () => {



    return (
        <div
            class={cx("flex column", css.profile)}>
            <div class={cx("pagePadding flex", css.title)}>
                <div class="flex column">
                <h1 data-translate>User profile</h1>
                {userState().user && <h3 class={"flex row center wrap gap"}><T p={":"}>Signed in as</T> <span class={"flex row center"}>
                    {userState().user?.username}
                    {userState().isAdmin && <FaRegularChessKing class={"marginLeft5"} color="hsla(var(--r-good), 1)" />}
                    {!userState().isAdmin && <FaRegularChessPawn class={"marginLeft5"} color="hsla(var(--r-primary), 0.7)" />}
                </span></h3>}
                </div>
                <Avatar upload class={"marginLeft"}></Avatar>
            </div>
            <section class={cx("grid center pagePadding", css.section)} max-col-count={2} min-col-size={"20rem"}>
                <div class={cx("flex column shadow rounding gridCard")}>
                    <h2 data-translate>Account status</h2>
                    <p><T>Email</T>: {userState().user?.email === "" ? t("No email registered.") : userState().user?.email}</p>
                    {userState().isAdmin && <p class={"flex row center"}><T>Admin</T>: {userState().isAdmin ? <>Yes <FaRegularChessKing class={"marginLeft5"} color="hsla(var(--r-good), 1)" /></> : "No"}</p>}
                    <div class="flexGrow" />
                    <AccountEmailChange></AccountEmailChange>
                </div>
                <div class={cx("flex column shadow rounding gridCard")}>
                    <h2 data-translate>Summary</h2>
                    <AccountSettings></AccountSettings>
                </div>
            </section>
        </div>

    )
}

export default Profile;
