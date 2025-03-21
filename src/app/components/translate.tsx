import cx from "classnames"
import css from "./translate.module.scss"

// type element = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" 

interface ITranslate {
    punctuation?: string,
    p?: string,
    // e?: element
    small?: boolean
    s?: boolean
}

export const Translate = (props: ITranslate & any) => {
    return <span class={cx(css.translate)}><span class={cx(css.translate, (props.small || props.s) ? css.small : "")} data-translate>{props.children}</span>{props.punctuation}{props.p}</span>
}

export default Translate;

export const T = Translate;

        {/* {(!props.e || props.e === "p") && <p class={cx(css.translate)} data-translate>{props.children}</p>} */}
        {/* {props.e === "h1" && <h1 class={cx(css.translate)} data-translate>{props.children}</h1>}
        {props.e === "h2" && <h2 class={cx(css.translate)} data-translate>{props.children}</h2>}
        {props.e === "h3" && <h3 class={cx(css.translate)} data-translate>{props.children}</h3>}
        {props.e === "h4" && <h4 class={cx(css.translate)} data-translate>{props.children}</h4>}
        {props.e === "h5" && <h5 class={cx(css.translate)} data-translate>{props.children}</h5>}
        {props.e === "h6" && <h6 class={cx(css.translate)} data-translate>{props.children}</h6>} */}
