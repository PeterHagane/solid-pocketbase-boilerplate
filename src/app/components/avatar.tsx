import cx from "classnames"
import css from "./avatar.module.scss"
import { Component, createSignal, JSX } from "solid-js"
import { createDropzone } from '@soorria/solid-dropzone'
import { pb, setUserState, updateCallback, userState } from "../stores/pocketBase"
import { t } from "../stores/translationStore"
import Loader from "./loader"
import { DropdownMenu } from "./dropdown"
import { uuid } from "../../utils/Utils"
import StatusIcon from "./statusIcon"
import { TbUpload } from "solid-icons/tb"
import { FiExternalLink } from "solid-icons/fi"
import { getInitials } from "./userIcon"


interface IAvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element
    height?: number | string
    width?: number | string
    upload?: boolean
}

// export const avatarUrl = `${pburl}api/files/${userState().user?.collectionId || ""}/${userState().user?.id}/`
// const url: any = pb.files.getURL(userState().user!, userState().user?.avatar, {'thumb': '250x250'});

export const Avatar: Component<IAvatarProps> = (
    props
) => {
    const [initialAvatar] = createSignal(userState().user?.avatar)
    const [isLoading, setIsLoading] = createSignal(false)
    const dropDownId = "avatarDropdown" + uuid()
    let fileRef: HTMLInputElement | undefined;

    const onDrop = (acceptedFiles: File[]) => {
        setIsLoading(true)
        updateCallback(
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

        setUserState((prev)=> { return {...prev, avatar: userState().user?.avatar} })
    }
    const dropzone = createDropzone({ onDrop })
    
    return <>
    <div 
    class={cx("shadow flex center", props.upload?"tooltip":"", css.avatarContainer, props.class)} 
    style={{"width": props.width?.toString() || "70px", "height": props.height?.toString() || "70px"}}
    data-size={props.width || props.height}
    data-tooltip={t("Drag & drop to upload")}
    
    {...dropzone.getRootProps()}>
        {isLoading() && <Loader></Loader>}
        
        <img src={pb.files.getURL(userState().user || {}, userState().user?.avatar, {'thumb': '64x64'})}></img>
        {!userState().user?.avatar && <div 
            class={css.userIcon}
        >
                <div class={css.initials}>{getInitials(userState().user?.name || userState().user?.username || "")}</div>
                <TbUpload class={css.upload} size={"30%"} color={"hsla(var(--r-primary),1)"}/>
        </div>}
        {props.upload && <>
        <div class={css.dropZone}><TbUpload opacity={dropzone.isDragActive ? 1 : 0} size={"30%"} color={"hsla(var(--r-white),1)"}/></div>
        <DropdownMenu
            onOpenChange={(e) => {console.log(e)}}
            placement="bottom"
            class={css.trigger}
            closeOnSelect
            triggerId={dropDownId}
            trigger={
                <span class={cx("flex row center", css.trigger, dropzone.isDragActive ? css.blur : "")} id={dropDownId}>
                </span>
            }>
                <button class="flex row center gap" data-gap={"10px"} onclick={() => {
                    if(fileRef)fileRef.click()
                    }}>
                     {t("Upload")}
                    <TbUpload class={"marginLeft"} size={"16px"} />
                    <input
                    ref={fileRef}
                    class={"displayNone"}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    onChange={(e) => {
                        onDrop(Array.from(e.currentTarget.files || []))
                    }}
                    >
                </input>
                </button>
                <button class="flex row alignItemsCenter gap" text-align={"left"} onclick={(e) => {
                        window.open(pb.files.getURL(userState().user || {}, userState().user?.avatar), '_blank')!.focus();
                    }}>
                     {t("View")}
                    <FiExternalLink class={"marginLeft"} />
                </button>
        </DropdownMenu>
        <div class={cx(css.icon)}>
           <StatusIcon  triggerCheck={initialAvatar() !== userState().user?.avatar && !isLoading()} size={30} ></StatusIcon>
        </div>
        {userState().user?.avatar && <div class={css.blur}></div>}
        </>}
    </div>
    
    
</>
}

export default Avatar
