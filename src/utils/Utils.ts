//misc utils
import { notify } from "../app/components/notify"
import { t } from "../app/stores/translationStore"

export const getDimensionsOfElementById = (id: string) => {
  const e = document.getElementById(id)
  return { x: e?.offsetWidth || 0, y: e?.offsetHeight || 0 }
}

export const changeStyleById = (id: string, cssClass: string, delay?: number, remove?: boolean) => {
  const e = document.getElementById(id)
  !remove && e?.classList.add(cssClass)
  remove && e?.classList.remove(cssClass)
  //cleanup for animations
  delay && delayStateChange(() => e?.classList.remove(cssClass), delay)
}

export const changeStyle = (element: HTMLElement | SVGSVGElement, cssClass: string, delay?: number, remove?: boolean) => {
  !remove && element?.classList.add(cssClass)
  remove && element?.classList.remove(cssClass)
  //cleanup for animations
  delay && delayStateChange(() => element?.classList.remove(cssClass), delay)
}

export const delayStateChange = (callback: () => void, delay: number) => {
  setTimeout(() => {
    return callback()
  }, delay)
}

export const delayStateChangeAsync = async (callback: () => void, delayms: number) => {
  delay(delayms)
  callback()
}

export const getScrolledDistance = () => {
  return Math.round(window.scrollY / (document.body.offsetHeight - window.innerHeight) * 100);
}

export const getDistanceFromTop = () => {
  return Math.round(window.scrollY);
}

export const getDistanceFromBottom = () => {
  return Math.round(document.body.offsetHeight - window.scrollY);
}

export const getElementsByQuery = (s: string) => {
  return document.querySelectorAll(s)
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


export function copyURI(event: any, string?: string, notification?: string) {
  event.preventDefault();
  console.log(event);
  string && navigator.clipboard.writeText(string).then(() => {
    notify({ title: notification ? `${notification} ${string}` : `Copied ${string}` })
  }, () => {
  });
}

export const copy = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const textToCopy = element.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Text copied to clipboard:', textToCopy);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  } else {
    console.error(`Element with ID "${elementId}" not found.`);
  }
};

export const getAge = () => {
  var bd = new Date("September 20, 1989 00:00:00");
  var ageDifMs = Date.now() - bd.getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const observer = (cssClassRemove: string, cssClassAdd: string, repeat?: boolean) => new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove(cssClassRemove)
      entry.target.classList.add(cssClassAdd)
    }
    if (!!repeat && !entry.isIntersecting) {
      entry.target.classList.remove(cssClassAdd)
      entry.target.classList.add(cssClassRemove)
    }
  })
})

export const capitalise = (text: string) => {
  return text[0].toUpperCase() + text.slice(1, text.length)
}
export const c = capitalise

export function callChildOnClick(parentElement: HTMLElement): void {
  const child: HTMLElement | null = parentElement.querySelector<HTMLElement>('*[onclick]'); // Select the first child with an onclick attribute
  if (child) {
    const childOnClick = child.onclick; // Get the onclick function
    if (typeof childOnClick === 'function') {
      const event = new MouseEvent('click'); // Create a synthetic event
      childOnClick.call(child, event); // Call the onclick function with the child as context and the event
    }
  }
}

export function getElementById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function isMobile() {
  let a = navigator?.userAgent
  if (a.includes("Mobile")) return true;
  if (a.includes("Android")) return true;
  if (a.includes("iOS")) return true;
  if (a.includes("iPhone")) return true;
  if (a.includes("iPad")) return true;
  if (a.includes("iPod")) return true
  return false;
}


export function getKeyByValue<T>(obj: Record<string, T>, value: T): string | undefined {
  // Iterate over the object's entries
  for (const [key, val] of Object.entries(obj)) {
    // Check if the current value matches the target value
    if (val === value) {
      return key; // Return the key if a match is found
    }
  }
  return undefined; // Return undefined if no match is found
}

export const getKeyByKey =(object: object, key: string)=>{
  const foundkey = Object.keys(object).find(k => k === key);
  return foundkey
}

export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function isValidEmail(email: string): boolean {
  // First trim the email
  const trimmedEmail = email.trim();
  
  // Check if there's a dot after the @ symbol
  const atIndex = trimmedEmail.lastIndexOf('@');
  if (atIndex === -1) return false;
  
  const domainPart = trimmedEmail.slice(atIndex + 1);
  const hasDotAfterAt = domainPart.includes('.');
  
  // Regular expression for general email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailRegex.test(trimmedEmail) && hasDotAfterAt;
}

export const isValidEmailInput = (address: string, ref?: HTMLInputElement): boolean =>{
  let isValid = isValidEmail(address)
  if(isValid && ref){
      ref.setCustomValidity("")
      return true
  }
  if(!isValid && ref){
      ref.setCustomValidity("Invalid email format.")
      return false}
  return false
}

export const setInputValidity = (isValid: boolean, ref?: HTMLInputElement): boolean =>{
  if(isValid && ref){
      ref.setCustomValidity("")
      return true
  }
  if(!isValid && ref){
      ref.setCustomValidity(`${t("Invalid email format")}.`)
      return false}
  return false
}

export const focusById =(id: string)=>{
  const i = getElementById(id)
  if(i && i.focus)i.focus()
}
