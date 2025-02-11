import { DropdownMenu } from "./dropdown"
import { availableLocales, currentLocale, oldLocale, setAndSaveLocale, translatePage } from "../stores/translationStore"
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { changeStyle } from "../../utils/Utils";

export const LanguageDropdown = (props: { class?: string }) => {
    return <div class={props.class}>
        <DropdownMenu
            triggerId="dropdownLanguageSpan"
            trigger={
                <span class={`flex row center`} id="dropdownLanguageSpan">
                    <span class={`fi fi-${currentLocale()?.id}`}></span>
                </span>}>

            {availableLocales.map((locale) => (
                <button class="flex row center gap" onclick={(e) => {
                    changeStyle(e.currentTarget as HTMLElement, "bounceChild", 200)
                    // translate(currentLocale(), locale, observer)
                    setAndSaveLocale(locale)
                    translatePage(oldLocale(), locale)

                }}>
                    {locale.name} <span class={`fi fi-${locale.id} marginLeft`}></span>
                </button>
            ))}

        </DropdownMenu>
    </div>
}