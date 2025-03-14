import { ParentProps } from "solid-js";

interface ITranslate {
    punctuation: string,
    p: string,
}

export const Translate = (props: ParentProps & ITranslate) => {
    return <span><span data-translate>{props.children}</span>{props.punctuation}{props.p}</span>
}

export default Translate;

export const T = Translate;