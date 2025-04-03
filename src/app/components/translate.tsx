import cx from "classnames"
import css from "./translate.module.scss"

// type e = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" 

interface ITranslate {
    punctuation?: string,
    p?: string,
    small?: boolean
    s?: boolean
}

export const Translate = (props: ITranslate & any) => {
    return <span class={cx(css.translate)}><span class={cx(css.translate, (props.small || props.s) ? css.smaller : "")} data-translate>{props.children}</span>{props.punctuation}{props.p}</span>
}

export default Translate;

export const T = Translate;