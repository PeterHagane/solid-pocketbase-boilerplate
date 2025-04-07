import { Component, createSignal, For } from "solid-js";
import { AccountEmailChange } from "../components/accountemailchange";
import { AccountSettings } from "../components/accountSettings";
import { T } from "../components/translate";
import { userState } from "../stores/pocketBase";
import css from "./profile.module.scss"
import cx from "classnames"
import { FaRegularChessKing, FaRegularChessPawn } from 'solid-icons/fa'
import { TransitionGroup } from "solid-transition-group"



export const Profile: Component = () => {



    return (
        <div
            class={cx("flex column", css.profile)}>
            <div class={css.title}>
                <h1 data-translate>User profile</h1>

                {userState().user && <h3 class={"flex row center wrap gap"}><T p={":"}>Signed in as</T> <span class={"flex row center"}>
                    {userState().user?.username}
                    {userState().isAdmin && <FaRegularChessKing class={"marginLeft5"} color="hsla(var(--r-good), 1)" />}
                    {!userState().isAdmin && <FaRegularChessPawn class={"marginLeft5"} color="hsla(var(--r-primary), 0.7)" />}
                </span></h3>}
            </div>



            <section class={cx("", css.section, css.masonryContainer)}>

                <div class={cx("flex column shadow rounding", css.card)}>
                <h2 data-translate>Summary</h2>
                <p><T>Name</T>: {userState().user?.username}</p>
                <p><T>Email</T>: {userState().email}</p>
                {userState().isAdmin && <p class={"flex row center"}><T>Admin</T>: {userState().isAdmin ? <>Yes <FaRegularChessKing class={"marginLeft5"} color="hsla(var(--r-good), 1)" /></> : "No"}</p>}
                <div class="flexGrow" />
                <AccountEmailChange></AccountEmailChange>
                </div>
                {/* <div class={cx("flex column shadow rounding", css.card)}>
                    <h2 data-translate>Summary</h2>
                    <AccountSettings></AccountSettings>
                </div> */}
                </section>
        </div>

    )
}

export default Profile;

