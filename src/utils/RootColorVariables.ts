export type Theme = "light" | "dark";

//example usage in css
//background-color: var(--error); (CORRECT)
//background-color: var(--r-error); (WRONG, not HSL)
//background-color: hsl(var(--r-error)); (CORRECT)
//background-color: hsl(var(--r-error), 0.5); (CORRECT)
export const setRootColorVars = (theme?: "light" | "dark", customTheme?: string[]) => {

    const sheet = document.styleSheets[0]
    // const rules = sheet.cssRules[0] as CSSStyleRule

    // const root = document.querySelector(':root')
    
    let colorVars = ""

    if(customTheme){

    }

    if(theme === "light"){
        themeLightRaw.forEach((colorVar)=>{
            colorVars = `${colorVars} ${colorVar};`
        })
    }

    if(theme === "dark"){
        themeDarkRaw.forEach((colorVar)=>{
            colorVars = `${colorVars} ${colorVar};`
        })
    }
    
    if (theme || customTheme) {
        mappedTheme.forEach((colorVar) => {
            colorVars = `${colorVars} ${colorVar};`
        })

        // clear out the old rules
        for (let i = 0; i < sheet.cssRules.length; i++) {
            let rule = sheet.cssRules[i] as CSSStyleRule

            if(rule.selectorText === ":root"){sheet.deleteRule(i)}
        }
        
        sheet.insertRule(`:root{${colorVars}}`)
    }
    return colorVars
}


//themeLightRaw and themeDarkRaw exists in order for you to be able to
//modify the opacity of the colour by using e.g. hsla(var(--r-surface-back), 0.5)
//and still stay consistent, not breaking the theme
const themeLightRaw = [
    "--r-surface-100: var(--color-light-100)",
    "--r-surface-200: var(--color-light-200)",
    "--r-surface-300: var(--color-light-300)",
    "--r-surface-400: var(--color-light-400)",
    "--r-surface-500: var(--color-light-500)",

    "--r-surface-back: var(--color-light-100)",
    "--r-surface-mid: var(--color-light-200)",
    "--r-surface-front: var(--color-light-300)",
    "--r-surface-contrast: var(--color-dark-200)",
    
    "--r-primary: var(--color-primary-strong)",
    "--r-medium: var(--color-primary-100)",
    "--r-light: var(--color-primary-400)",
    "--r-dim: var(--color-primary-600)",
  
    "--r-text-primary: var(--black)",
    "--r-text-secondary: var(--color-dark-300)",
    "--r-text-contrast: var(--white)",
  
    "--r-approve: var(--color-approve)",
    "--r-warning: var(--color-warning)",
    "--r-danger:var(--color-danger)",
    "--r-error: var(--color-error)",
    "--r-good: var(--color-good)",

    "--r-ocean: var(--color-ocean)",
    "--r-nightsky: var(--color-nightsky)",

    // "--p-shadow: hsla(var(--black))",
    "--p-shadow: hsla(from hsla(var(--black)) h s calc(l + 70))",
    // from hsla(var(--black) h s calc(l), 0.5)
    //           hsla(from hsla(var(--r-surface-back)) h s calc(l + 4))
    
]

const themeDarkRaw = [
    "--r-surface-100: var(--color-dark-100)",
    "--r-surface-200: var(--color-dark-200)",
    "--r-surface-300: var(--color-dark-300)",
    "--r-surface-400: var(--color-dark-400)",
    "--r-surface-500: var(--color-dark-500)",

    "--r-surface-back: var(--color-dark-100)",
    "--r-surface-mid: var(--color-dark-200)",
    "--r-surface-front: var(--color-dark-300)",
    "--r-surface-contrast: var(--color-light-200)",
    
    "--r-primary: var(--color-primary-strong)",
    "--r-medium: var(--color-primary-100)",
    "--r-light: var(--color-primary-400)",
    "--r-dim: var(--color-primary-600)",
  
    "--r-text-primary: var(--white)",
    "--r-text-secondary: var(--color-dark-800)",
    "--r-text-contrast: var(--black)",
  
    "--r-approve: var(--color-approve)",
    "--r-warning: var(--color-warning)",
    "--r-danger:var(--color-danger)",
    "--r-error: var(--color-error)",
    "--r-good: var(--color-good)",
    
    "--r-ocean: var(--color-ocean)",
    "--r-nightsky: var(--color-nightsky)",

    "--p-shadow: hsla(var(--black))",
    // "--r-shadow: hsla(from hsla(var(--black)) h s calc(l), 0.5)",
]

// background: rgb(73,69,143);
// background: linear-gradient(90deg, rgba(73,69,143,1) 0%, rgba(0,138,132,1) 100%);

const mappedTheme = [
    "--surface-100: hsl(var(--r-surface-100))",
    "--surface-200: hsl(var(--r-surface-200))",
    "--surface-300: hsl(var(--r-surface-300))",
    "--surface-400: hsl(var(--r-surface-400))",
    "--surface-500: hsl(var(--r-surface-500))",

    // "--surface-back:     hsl(var(--r-surface-back))",
    // "--surface-mid:      hsl(var(--r-surface-mid))",
    // "--surface-front:    hsl(var(--r-surface-front))",
    // "--surface-contrast: hsl(var(--r-surface-contrast))",
    
    "--primary:         hsl(var(--r-primary))",
    "--medium:          hsl(var(--r-medium))",
    "--light:           hsl(var(--r-light))",
    "--dim:             hsl(var(--r-dim))",
  
    "--text-primary:    hsl(var(--r-text-primary))",
    "--text-secondary:  hsl(var(--r-text-secondary))",
    "--text-contrast:   hsl(var(--r-text-contrast))",

    "--approve:         hsl(var(--r-approve))",
    "--warning:         hsl(var(--r-warning))",
    "--danger:          hsl(var(--r-danger))",
    "--error:           hsl(var(--r-error))",
    "--good:            hsl(var(--r-good))",

    "--ocean:           hsl(var(--color-ocean))",
    "--nightsky:        hsl(var(--color-nightsky))",

    "--shadow:          var(--p-shadow)",

    "--gradient: linear-gradient(90deg, hsla(var(--r-nightsky), 0.1) 0%, hsla(var(--r-ocean), 0.1) 100%);"
]


// :root{
//     --white: 360, 100%, 100%;
//     --black: 0, 0%, 0%;
//      /** CSS DARK THEME PRIMARY COLORS */
//     --color-primary-strong: 212, 100%, 44%;
//     --color-primary-100:    204, 100%, 50%;
//     --color-primary-200:    210, 100%, 65%;
//     --color-primary-300:    212, 100%, 71%;
//     --color-primary-400:    214, 100%, 76%;
//     --color-primary-500:    215, 100%, 81%;
//     --color-primary-600:    217, 100%, 85%;
//     // ** CSS DARK THEME SURFOLORS */         
//     --color-dark-100:       0, 0%, 7%;    
//     --color-dark-200:       0, 0%, 16%;    
//     --color-dark-300:       0, 0%, 25%;    
//     --color-dark-400:       0, 0%, 34%;    
//     --color-dark-500:       0, 0%, 44%;    
//     --color-dark-600:       0, 0%, 55%;    
//     // ** CSS DARK THEME MIXEFACE COLORS */   
//     --color-dark-mixed-100: 217, 21%, 12%; 
//     --color-dark-mixed-200: 215, 12%, 20%; 
//     --color-dark-mixed-300: 218, 7%, 29%; 
//     --color-dark-mixed-400: 222, 5%, 38%; 
//     --color-dark-mixed-500: 218, 3%, 48%; 
//     --color-dark-mixed-600: 223, 3%, 58%; 
//     /** CSS LIGHT THEME SURFALORS */          
//     --color-light-100:      0, 0%, 96%;    
//     --color-light-200:      0, 0%, 96%;    
//     --color-light-300:      0, 0%, 97%;    
//     --color-light-400:      0, 0%, 97%;    
//     --color-light-500:      0, 0%, 98%;    
//     --color-light-600:      0, 0%, 98%;    
//     /** CSS LIGHT THEME MIXEDACE COLORS */    
//     --color-light-mixed-100: 219, 49%, 93%;
//     --color-light-mixed-200: 220, 48%, 94%;
//     --color-light-mixed-300: 222, 48%, 95%;
//     --color-light-mixed-400: 218, 48%, 95%; 
//     --color-light-mixed-500: 220, 47%, 96%; 
//     --color-light-mixed-600: 217, 50%, 97%; 
    
//     --color-approve: 218.87, 74.65%, 58.24%;
//     --color-warning:  50.84, 100%, 37.25%;
//     --color-danger: 36, 100%, 37.25%;
//     --color-error: 18.95, 100%, 37.25%;
//     --color-good: 137.95, 60%, 38.24%;
//     }
    