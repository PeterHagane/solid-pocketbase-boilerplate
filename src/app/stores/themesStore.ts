import { createSignal } from "solid-js";
import { notify } from "../components/notify";
import { addFillToIconsWithClass } from "../../utils/CssUtils";
import { tm } from "./translationStore";

export type ITheme = "Dark" | "Light" | "Custom"

const [theme, setTheme] = createSignal<string>(getLocalStorageTheme()); //see colourThemes.css
export const iconFill = "hsla(var(--r-primary), 0.4)"

export function saveTheme(newTheme: ITheme, toast: boolean = true) {
    const htmlElement = document.querySelector('html');
    if (htmlElement && htmlElement.getAttribute('data-theme') !== newTheme) {
        htmlElement.setAttribute('data-theme', newTheme);//set data-theme for colourThemes.css
        setTheme(newTheme); // Update the signal
        localStorage.setItem('theme', newTheme); // to to localStorage

        //other stuff
        if (toast) notify(tm("Changed theme", ": ", newTheme))
        addFillToIconsWithClass(iconFill);
    }
}

export function getLocalStorageTheme(): ITheme {
    return localStorage.getItem('theme') as ITheme || "Light"; // Default theme is "light"
}

export function getTheme(): string {
    return theme()
}

// Usage example
// saveTheme("dark");
// console.log(theme()); // Outputs the current theme
