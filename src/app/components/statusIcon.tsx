import cx from "classnames"
import css from "./statusIcon.module.scss"
import { Component, createEffect, createSignal, JSX } from "solid-js"
import { FaSolidCheck, FaSolidXmark } from 'solid-icons/fa';
import { delayStateChange } from "../../utils/Utils";
import Loader from "./loader";

interface IAvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element
    triggerCheck?: boolean
    triggerCross?: boolean
    loading?: boolean
    size?: number | string
    opacity?: number | string
}

export const StatusIcon: Component<IAvatarProps> = (
    props
) => {
    const [triggerCheck, setTriggerCheck] = createSignal(false)
    const [triggerCross, setTriggerCross] = createSignal(false)

    let checkRef!: SVGSVGElement
    let crossRef!: SVGSVGElement
    let childRef!: HTMLDivElement
    let loaderRef!: HTMLDivElement

    createEffect(() => {      
        if(!!props.triggerCheck){
            setTriggerCheck(true)
            delayStateChange(() => {
                setTriggerCheck(false)
            }
            , 1000)
        }
    })

    createEffect(() => {
        if(!!props.triggerCross){
            setTriggerCross(true)
            delayStateChange(() => {
                setTriggerCross(false)
            }
            , 1000)
        }            
    })

    createEffect(() => {
        if(!!triggerCheck()){
            childRef.style.opacity = "0"
            checkRef.style.opacity = "1"
            checkRef.classList.add("popAndWiggle")
            delayStateChange(() => {
            checkRef.style.opacity = "0"
            checkRef.classList.remove("popAndWiggle")
            childRef.style.opacity = "1"
        }
        , 1000)
        }      
    })

    createEffect(() => {
        if(!!triggerCross()){
            childRef.style.opacity = "0"
            crossRef.style.opacity = "1"
            crossRef.classList.add("popAndWiggle")
            delayStateChange(() => {
            crossRef.style.opacity = "0"
            crossRef.classList.remove("popAndWiggle")
            childRef.style.opacity = "1"
        }
        , 1000)
        } 
    })

    createEffect(()=>{
        if(props.loading){
            childRef.style.opacity = "0"
            loaderRef.style.opacity = "1"
        }else{
            loaderRef.style.opacity = "0"
            childRef.style.opacity = "1"
        }
    })

    return <div
    style={{"opacity": props.opacity?.toString() || "1"}}
    class={cx("flex center absolute", css.iconContainer, props.class)} >
        <FaSolidCheck  
        ref={checkRef} 
        size={props.size?.toString() || 22} 
        opacity={0}
        class={cx(
            css.check, "absolute"
        )}/>

        <FaSolidXmark 
        ref={crossRef} 
        size={props.size?.toString() || 22} 
        opacity={0}
        class={cx(
            css.cross, "absolute"
        )}/>

        <Loader class={cx(css.loading, "absolute")} style={{height: "22px", width: "18px"}} ref={loaderRef} opacity={0}/>

        <span 
        ref={childRef} 
        style={{"width": props.size?.toString() || "22", "height": props.size?.toString() || "22", "opacity": 1}}
        class={
            cx(css.child, "")
        }>
            {props.children}
        </span>

        
    </div>

}

export default StatusIcon