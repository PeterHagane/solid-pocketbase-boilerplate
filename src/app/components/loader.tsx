import cx from "classnames"
import css from "./loader.module.scss"
import { JSX } from "solid-js"

export const Loader = ({}:{children?: JSX.Element}) => {
    return <div class={cx(css.blur)} >
        <div class="loader"></div>
    </div>

}

export default Loader
