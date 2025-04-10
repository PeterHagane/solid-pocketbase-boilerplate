import { FiEdit3, FiTrash } from "solid-icons/fi"
import { changeStyle, delayStateChange } from "../../utils/Utils"
import css from "./inputassistant.module.scss"
import cx from "classnames"

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
    return <>
        {props.label && <label data-translate for={props.labelId}>{props.labelValue}</label>}
        {props.edit && <FiEdit3 data-edit size={22}/>}
        {props.reset && <button data-reset 
            class={cx("flex center", css.resetButton)}
            onMouseDown={(e)=>{ //use onMouseDown instead of onClick to prevent focusing button
                e.preventDefault()
                changeStyle(e.target as HTMLElement, "bounceSVG", 200)
                changeStyle(e.target as HTMLElement, "fadeOut", 400)
                if(props.resetCallback)delayStateChange(()=>props.resetCallback!(), 200)
            }}
        >
            <FiTrash class="noClick" />
        </button>}
    </>
}