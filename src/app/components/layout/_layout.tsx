import { createEffect, createSignal, JSX } from "solid-js";
import Header from "./header";
import Footer from "./footer";
import Aside from "./aside";
import cx from "classnames";
import { useLocation } from "@solidjs/router";

export type LayoutClass = "justifyContentCenter" | ""
export const [layoutType, setLayoutType] = createSignal<LayoutClass>("")

export interface ILayoutProps {
    children: JSX.Element
}

export const Layout = (_props: ILayoutProps) => {

    const location = useLocation()

    createEffect(() => {
        if (location.pathname.includes("/")) setLayoutType("")
        if (location.pathname.includes("/login")) setLayoutType("justifyContentCenter")
        if (location.pathname.includes("/profile")) setLayoutType("justifyContentCenter")
    })

    return (
        <>
            <Header class=""></Header>
            <Aside class="left"></Aside>
            <main class={cx("flex center", layoutType())}>
                {_props.children}
            </main>
            <Aside class="right "></Aside>
            <Footer class=""></Footer>
        </>
    )
}

export default Layout;
