import cx from "classnames"
import css from "./avatar.module.scss"
import { Component, createSignal, JSX } from "solid-js"
import { createDropzone } from '@soorria/solid-dropzone'


interface IAvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element
    height?: number | string
    width?: number | string
}

export const Avatar: Component<IAvatarProps> = (
    props
) => {
    const [initialAvatar, setInitialAvatar] = createSignal("")
    
    const onDrop = (acceptedFiles: File[]) => {
        // Do something with the files
        console.log(acceptedFiles)
    }

    const dropzone = createDropzone({ onDrop })

    return <div 
    style={{"width": props.width?.toString() || "80px", "height": props.height?.toString() || "80px"}}
    data-tooltip={"Upload new profile image"}
    class={cx("tooltip",css.avatarContainer, props.class)} 
    {...dropzone.getRootProps()}>

        <input {...dropzone.getInputProps()}></input>
        {<div>{dropzone.isDragActive ? "upload" : "avatar"}</div>}

    </div>

}

export default Avatar