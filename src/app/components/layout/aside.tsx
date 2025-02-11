import css from "./footer.module.scss"
import cx from "classnames"
export const Aside = (_props: any) => {
    return <aside class={cx("flex row center", _props.class, css.aside)}>
        {_props.children}
    </aside>
};

export default Aside;
