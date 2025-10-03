import { T } from "../components/translate";
import cx from "classnames";
import css from "./profile.module.scss"
import { Component } from "solid-js";

export const NotFound: Component = () => {
    return (
            <section class={cx("margin0auto")}>
                <h1><T>404 - no such page</T>.</h1>
            </section>

    )
}

export default NotFound;
