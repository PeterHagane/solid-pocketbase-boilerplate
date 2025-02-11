

export const Translate = (props: any) => {
    return <span><span data-translate>{props.children}</span>{props.punctuation}{props.p}</span>
}

export default Translate;

export const T = Translate;