import cx from "classnames"
import css from "./avatar.module.scss"
import { Component, createSignal, JSX } from "solid-js"
import { createDropzone } from '@soorria/solid-dropzone'
import { pb, pburl, setUserState, updateCallback, userState } from "../stores/pocketBase"
import { t } from "../stores/translationStore"
import Loader from "./loader"


interface IAvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element
    height?: number | string
    width?: number | string
}

export const Avatar: Component<IAvatarProps> = (
    props
) => {
    const [currentAvatar, setCurrentAvatar] = createSignal<any>(undefined)
    const [newAvatar, setNewAvatar] = createSignal<any>(undefined)
    const [isLoading, setIsLoading] = createSignal(false)

    const url = `${pburl}api/files/${userState().user?.collectionId || ""}/${userState().user?.id}/`

    const onDrop = (acceptedFiles: File[]) => {
        // Do something with the files
        console.log(acceptedFiles)

        setIsLoading(true)
        const r = updateCallback(
            ()=>{
                return pb.collection("users").update(
                    userState().user?.id || "", 
                    {avatar: acceptedFiles[0]},
                )
            },
            t("Avatar updated"),
            t("Error updating avatar"),
            ()=>{setIsLoading(false)},
            ()=>{setIsLoading(false)},
        )

        console.log(r)
        setUserState((prev)=> { return {...prev, avatar: undefined} })
    }

    const dropzone = createDropzone({ onDrop })

    return <div 
    class={cx("tooltip",css.avatarContainer, props.class)} 
    style={{"width": props.width?.toString() || "70px", "height": props.height?.toString() || "70px"}}
    data-tooltip={"Upload new profile image"}
    
    {...dropzone.getRootProps()}>
        {isLoading() && <Loader></Loader>}
        <input {...dropzone.getInputProps()}></input>
        <div class={css.dropZone}>{dropzone.isDragActive ? "upload" : "avatar"}</div>
        <img src={url + userState().user?.avatar}></img>

    </div>
}

export default Avatar
