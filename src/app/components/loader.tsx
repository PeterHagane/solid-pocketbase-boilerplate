import cx from "classnames"
import css from "./loader.module.scss"
import { Component, JSX } from "solid-js"

interface ILoaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
    opacity?: number | string
}

export const Loader: Component<ILoaderProps> = (props) => {
    return <div style={{opacity: props.opacity}} {...props} class={cx(css.blur)} >
        <div class="loader"></div>
    </div>

}

export default Loader
