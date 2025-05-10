import cx from 'classnames';
import css from './input.module.scss';
import { Component, createEffect, createSignal, JSX } from 'solid-js';
import { FiEdit3 } from 'solid-icons/fi';
import { changeStyle, delayStateChange, getElementById, uuid } from '../../utils/Utils';
import { t } from '../stores/translationStore';
import StatusIcon from './statusIcon';
import { TiBackspaceOutline } from 'solid-icons/ti';

interface IInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    edit?: boolean;
    ref?: HTMLInputElement;
    initialValue?: string | number;
    resetCallback?: () => void;
    onInputCallback?: (value: string) => void;
    "data-key"?: string;
    validity?: boolean;
    didSucceed?: boolean;
    tooltip?: string;
    isLoading?: boolean;
    didFail?: boolean;
}

//example use:
// const[text, setText] = createSignal<string>("")
// <Input 
// initialValue={""}
// edit
// label={"name"}
// onInputCallback={setText}
// resetCallback={()=>{
//     setText("")
// }}
// wiggle={hasUpdated()}
// tooltip={"Type your name here"}
// isLoading={isLoading()}
// ></Input>

export const Input: Component<IInputProps> = (
    props,
) => {
    const hasInitialValue = !!props.initialValue || false
    const [hasValue, setHasValue] = createSignal(hasInitialValue);
    const [isEdited, setIsEdited] = createSignal(false);
    const [hasFocus, setHasFocus] = createSignal(false);
    const [delayedSucceed, setDelayedSucceed] = createSignal(false);
    const [delayedFail, setDelayedFail] = createSignal(false);


    const id = props.id || "input" + uuid();

    let editRef!: SVGSVGElement;
    
    createEffect(() => {
        const input = getElementById(id) as HTMLInputElement
        if(input && props.initialValue === input.value){
            setIsEdited(false)
        }
        if(input && props.disabled){
            input.onclick = (e) => {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        if(props.didSucceed){
            setDelayedSucceed(true)
            delayStateChange(() => {
                setDelayedSucceed(false);
            }, 1000);
        }
        if(props.didFail){
            setDelayedFail(true)
            delayStateChange(() => {
                setDelayedFail(false);
            }, 1000);
        }

        if(props.edit && !delayedSucceed()){
            if(!isEdited() && !hasFocus()){
                editRef.style.opacity = "1"
            }
            if(hasFocus() || props.disabled){
                editRef.style.opacity = "0"
            }
        }
    });

    return (
        <span
            has-label={!!props.label}
            has-edit={props.edit}
            has-reset={!!props.resetCallback}
            is-edited={isEdited()}
            has-value={hasValue()}
            has-validity={props.validity}
            has-focus={hasFocus()}

            class={cx(css.inputContainer, !!props.tooltip ? "tooltip": "")}
            data-tooltip={props.disabled ? t(props.tooltip) : ""}
            >
            
            
            <input
                {...props}
                id={id}
                value={props.initialValue || ""}
                class={cx(css.input, props.class, )}
                
                style={props.style}
                ref={props.ref}
                data-key={props["data-key"]}
                onInput={(e) => {
                    if(props.onInputCallback)props.onInputCallback(e.currentTarget.value)
                    if(e.currentTarget.value.length > 0)setHasValue(true)
                    if(e.currentTarget.value.length < 1)setHasValue(false)
                    if(props.initialValue !== e.currentTarget.value)setIsEdited(true)
                    if(props.initialValue === e.currentTarget.value)setIsEdited(false)
                    if(props.initialValue === undefined && e.currentTarget.value === "")setIsEdited(false)
                }}
                onFocus={() => {setHasFocus(true)}}
                onBlur={() => {setHasFocus(false)}}
                disabled={props.disabled}
            />

            {props.label && <label for={id}>{props.label}</label>}
            
            
            
            <StatusIcon 
                triggerCheck={delayedSucceed()} 
                triggerCross={delayedFail()}
                loading={props.isLoading} 
                >
                <FiEdit3 ref={editRef} color={"hsla(var(--r-primary),0.5)"} edit-icon size={22} opacity={0}/>
                {/* <FaSolidCheck ref={checkRef} check-icon size={22} opacity={0}/> */}
            </StatusIcon>

            <button
                style={{"opacity": (props.resetCallback && isEdited()) ? 1 : 0}}
                class={cx("flex center")}
                onMouseDown={(e)=>{ //use onMouseDown instead of onClick to prevent focusing button
                    e.preventDefault()
                    changeStyle(e.target as HTMLElement, "bounceSVGleft", 200)

                    if(props.resetCallback)props.resetCallback()

                    const input = getElementById(id) as HTMLInputElement
                    if(input){
                        input.value = props.initialValue?.toString() || ""
                        input.focus()
                        input.dispatchEvent(new Event("input", { bubbles: true }))//when resetting, simulate input to trigger onInput
                    }
                }}
                >
                    <TiBackspaceOutline class="noClick" />
            </button>
            
        </span>
    );
};