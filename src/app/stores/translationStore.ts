import { createSignal, from } from "solid-js";
import gb from "../locales/gb.json"
import no from "../locales/no.json"
import fr from "../locales/fr.json"
import { notify } from "../components/notify";
import { getKeyByValue } from "../../utils/Utils";

//https://www.iso.org/obp/ui/#search/code/ id should be alpha 2 code
//id MUST ALSO BE the name of the corresponding json file in locales folder
export interface Translations {
    [key: string]: string;
}

export const availableLocales = [
    { name: 'English', id: 'gb', translations: <Translations>gb },
    { name: 'Norsk', id: 'no', translations: <Translations>no },
    { name: 'Français', id: 'fr', translations: <Translations>fr }
] as const

export type Locale = typeof availableLocales[number]

export const loadLocale = (): Locale => {
    return JSON.parse(localStorage.getItem("locale")!) as Locale
}

export const [oldLocale, setOldLocale] = createSignal<Locale>(availableLocales[0])
export const [currentLocale, setCurrentLocale] = createSignal<Locale>(
    loadLocale() || availableLocales[0]
)

export const setAndSaveLocale = async (toLocale: Locale) => {
    if (currentLocale()?.id !== toLocale.id) {
        setOldLocale(currentLocale())
        setCurrentLocale(toLocale)
        notify(`${t("Changed language")}: ${toLocale.name}`)
        localStorage.setItem("locale", JSON.stringify(toLocale))
    }
}



export const translateFromEnglish = (key?: string) => {
    if (!key) return
    let translation = currentLocale().translations[key]
    !translation && (translation = key)
    return translation
}


export const translateMultipleFromEnglish = <T extends any[]>(...keys: T) => {
    if (!keys.length) return ""
    let translation = ""
    keys.forEach((key) => {
        let t = translateFromEnglish(key)
        !!t && (translation += `${t}`)
    })
    return translation
}

export const t = translateMultipleFromEnglish
export const tm = translateMultipleFromEnglish

export function monitorDataTranslateElements() {
    // Create a new MutationObserver instance
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check if new nodes have been added
            if (mutation.addedNodes.length && mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    //first translate to english
                    //then from english to target language
                    if (oldLocale()?.id !== currentLocale()?.id) {
                        oldLocale().id !== "gb" && translateDataTranslateElements(oldLocale(), availableLocales[0], node)
                        translateDataTranslateElements(availableLocales[0], currentLocale(), node)
                    }
                });

            }
        });

    });

    // Start observing the document body for child node additions
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

// Call the function to start monitoring
export function translateDataTranslateElements(fromLocale: Locale, toLocale: Locale, node?: Node) {
    if (node instanceof HTMLElement) {
        if (node.hasAttribute('data-translate')) {
            const oldText = node.innerText
            const key = getKeyByValue(fromLocale.translations, oldText)
            if (key) {
                let translatedText = toLocale.translations[key]
                if (translatedText) node.innerText = translatedText
                else node.innerText = availableLocales[0].translations[key as keyof typeof gb]
            }
        }
        // Recursively call this function for each child node

        node.childNodes.forEach(child => translateDataTranslateElements(fromLocale, toLocale, child));
    }
}



export const translatePage = (fromLocale: Locale, toLocale: Locale) => {
    //don't translate to same language
    if (fromLocale?.id !== toLocale.id) {
        fromLocale.id !== "gb" && translateElements(fromLocale, availableLocales[0])
        translateElements(availableLocales[0], toLocale)
    }
}


export const translateElements = (fromLocale: Locale, toLocale: Locale) => {
    let elements = document.querySelectorAll('[data-translate]') as NodeListOf<HTMLElement>
    elements.forEach((element) => {
        const text = element.innerText // Get the text content of the element
        let translationKey = Object.keys(fromLocale.translations).find(key => fromLocale.translations[key] === text)
        if (translationKey) {
            const targetTranslation = toLocale.translations[translationKey]; // Attempt to get the target translation
            if (targetTranslation) {
                // If the target translation exists, set the innerText to the target translation
                element.innerText = targetTranslation;
            } else {
                // If the target translation does not exist, fall back to the English translation
                const fallbackTranslation = availableLocales[0].translations[translationKey as keyof typeof gb]; // Get the English translation
                element.innerText = fallbackTranslation || text; // Use the English translation or the original text if not found
            }
        } else {
            element.innerText = text;
        }
    });
};