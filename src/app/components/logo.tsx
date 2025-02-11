import css from "./logo.module.scss";
import cx from "classnames";
import { Component, JSX } from "solid-js";

export const Logo: Component<{ onClick?: () => void, class?: string, showName?: boolean, showId?: boolean }> = (props) => {
    const style: JSX.CSSProperties = {
        "color": "white"
    }

    return <div onclick={props.onClick} class={cx(css.container, props.class, "flex row center gap")} >
        <img class={css.logo} src="/logo.svg" style={{ ...style }}></img>
        <span class={cx(css.name, !props.showName ? "hide" : "show")} style={{ ...style }}>HAPROCO</span>
        <span class={cx(css.id, !props.showId ? "hide" : "show")} style={{ ...style }}>ID</span>
    </div>
}
