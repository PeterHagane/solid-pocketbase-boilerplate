import css from "./footer.module.scss"
import cx from "classnames"
export const Footer = (_props: any) => {
    return <footer class={cx("flex row center", css.footer, _props.class)}>
        {_props.children}
    </footer>
};

export default Footer;
