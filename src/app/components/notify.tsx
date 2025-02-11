import { JSX } from "solid-js/jsx-runtime";
import toast from "solid-toast";
import { t } from "../stores/translationStore";


interface INotification {
    title?: string,
    message?: string,
    style?: JSX.CSSProperties,
    icon?: JSX.Element,
    duration?: number,
    color?: string,
    textColor?: string,
    dismissible?: boolean,
    onClick?: () => void
}

export const notify = (_props: INotification | string) => {
    if (typeof _props !== "string") {
        const props = Object.assign({ duration: 1500 }, _props)//example default props

        toast((_t) => (
            <div onClick={() => { props.dismissible && toast.dismiss(_t.id) }}>
                {t(props.title)}<br />
                {t(props.message)}
            </div>
        ),
            {
                icon: props.icon,
                duration: props.duration,
                className: "",
                style: {
                    "background-color": props.color || "hsla(var(--r-surface-100), 1)",
                    "color": props.textColor || "hsla(var(--r-text-primary), 1)",
                    ...props.style
                }
            }
        )
    }

    if (typeof _props === "string") {
        toast((_t) => (
            <div onClick={() => { toast.dismiss(_t.id) }}>
                {t(_props)}
            </div>
        ),
            {
                duration: 1500,
                className: "",
                style: {
                    "background-color": "hsla(var(--r-ocean), 0.5)",
                    "color": `hsla(var(--r-text-primary), 1)`,
                }
            }
        )
    }
}