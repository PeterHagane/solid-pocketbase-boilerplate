import { delay, getElementsByQuery } from "./Utils"

export interface IAnimateById {
    steps: IAnimationStep[]
    id?: string
    element?: HTMLElement
    clearExistingAnimations?: CSSClassAnimation[] | boolean
    persist?: boolean //only 
  }
  
  export interface IAnimationStep {
    cssClass: string
    duration: number
    persist?: boolean
    callback?: () => void
  }
  
//example usage
// animateById({
//     steps: [{
//       cssClass: "fadeOut",
//       duration: 500
//     }, {
//       cssClass: "fadeIn",
//       duration: 500
//     },
//     ], id: mobileId, clearExistingAnimations: []
//   })

  export function animateById({
    steps,
    id,
    element,
    clearExistingAnimations,
  }:IAnimateById) {
    const e = id ? document.getElementById(id) : element
    
    if(typeof clearExistingAnimations !== "boolean" && !!clearExistingAnimations && clearExistingAnimations?.length > 0){
      for(let cssClass in clearExistingAnimations){
      e?.classList.remove(cssClass)
    }}
    if(typeof clearExistingAnimations !== "undefined" && !!clearExistingAnimations){
      for(let cssClass of CSSClassAnimationStrings){
        e?.classList.remove(cssClass)
      }
    }
    
    const loop = async () => {
      for (let i = 0; i < steps.length; i++) {
        e?.classList.add(steps[i].cssClass)
        //calling async function inside a loop in an async function pauses the async function
        await delay(steps[i].duration)
        !steps[i].persist && e?.classList.remove(steps[i].cssClass)
        //you can fire a passed function, e.g. state change after animation is done
        //steps[i].callback() throws undefined error even when truth checking, so...
        //@ts-ignore that shit
        !!steps[i].callback && steps[i].callback()
      }
    }
    loop()
  }



//these animations are defined in animations.css. Make sure to add it here if you add it there.
export const CSSClassAnimationStrings = ["slideIn", "slideOut", "slideIn200", "slideOut200", "slideIn100", "slideOut100", "fadeOut", "fadeOut100", "fadeIn200", "fadeOut200", "slideInRight", "slideOutRight", "slideInRight200", "slideOutRight200", "slideInRight100", "slideOutRight100", "hide", "show", "slideDown200", "slideUp200"] as const
//can be iterated to check if any given string is of this type
export type CSSClassAnimation = typeof CSSClassAnimationStrings[number]

// export type CSSAnimation = "slideIn" | "slideOut" | "slideIn200" | "slideOut200" | "slideIn100" | "slideOut100" | "fadeOut" | "fadeOut100" | "fadeOut200" | "slideInRight" | "slideOutRight" | "slideInRight200" | "slideOutRight200" | "slideInRight100" | "slideOutRight100"

export const scrambleType = async (id: string, speed: number = 4)=>{
  let elements = getElementsByQuery(id)
  let realText: string[] = []

  elements.forEach((e)=>{
      realText.push(e.innerHTML)
  })

  for (let [i, e] of elements.entries()){
      printEffect(e, realText[i], speed)
  }
}

export const printEffect = async (element: globalThis.Element, realText: string, scramble?: number) =>{
  const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!`\"#¤%&/()=?`[]<>-_@£$€{}"
  const c=()=>s.charAt(Math.random()*s.length|0);
  
  let tempText = ""

  for(let i = 0; i < realText.length; i++){
      if(!!scramble)for(let s = 0; s < scramble; s++){
          await delay(50 / scramble)
          element.innerHTML = tempText + c()
      }
      await delay(50)    
      tempText = tempText + realText[i]
      element.innerHTML = tempText
  }    
}

export default animateById

//just going to leave this leftover code littered here

// import { delay } from "./Utils"
// export function animate(ref: HTMLElement, steps: IAnimationStep[]) {
//     for (let step of steps) {

//         setTimeout(() => {
//             () => {

//             }
//         }, step.duration)
//         // animationGenerator(ref, steps)
//     }
// }


// export function* animationGenerator(steps: IAnimationStep[], ref?: HTMLElement) {
//     // if (ref === HTMLElement){
        
//         let i = 0;
//         while(i < steps.length){
//             yield steps[i].cssClass
//             i++
//         }


//         // for(let i = 0; i < steps.length, i++;){
//         //     yield steps[i].cssClass
//         //     setTimeout(() => {()=>{
                
//         //     }
//         //       }, steps[i].duration)
//         // }
//     // }
    
//     // if(ref !== HTMLElement){
//     //     console.log("ref must be an HTMLElement")
//     // }
// }




