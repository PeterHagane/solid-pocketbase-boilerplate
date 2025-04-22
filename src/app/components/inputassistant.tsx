import { FiEdit3 } from "solid-icons/fi"
import { changeStyle, delayStateChange } from "../../utils/Utils"
import css from "./inputassistant.module.scss"
import cx from "classnames"
import { TiBackspaceOutline } from 'solid-icons/ti'
import { createSignal } from "solid-js"
interface IInputAssistant {
    "data-edit": string,
    "data-refresh":  string,
    labelId: string,
    labelValue: string,
    label: boolean,
    edit: boolean,
    reset: boolean
    resetCallback?: ()=>void 
}

export const InputAssistant = (props: Partial<IInputAssistant>) =>{
    const [hide, setHide] = createSignal(false)

    return <>
        {props.label && <label data-translate for={props.labelId}>{props.labelValue}</label>}
        {props.edit && <FiEdit3 opacity={hide() ? 0 : 1} data-edit size={22}/>}
        {props.reset && <button data-reset 
            class={cx("flex center", css.resetButton)}
            onMouseDown={(e)=>{ //use onMouseDown instead of onClick to prevent focusing button
                e.preventDefault()
                setHide(true)
                changeStyle(e.target as HTMLElement, "bounceSVGleft", 200)
                changeStyle(e.target as HTMLElement, "fadeOut", 400)
                delayStateChange(()=>setHide(false), 400)
                if(props.resetCallback)delayStateChange(()=>props.resetCallback!(), 200)
            }}
        >
            <TiBackspaceOutline  class="noClick" />
        </button>}
    </>
}