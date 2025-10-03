import cx from 'classnames';
import css from './input.module.scss';
import { mergeRefs, Ref } from "@solid-primitives/refs";
import { Component, createEffect, createSignal, JSX } from 'solid-js';
import { FiEdit3, FiSearch } from 'solid-icons/fi';
import { changeStyle, delayStateChange, uuid } from '../../utils/Utils';
import { t } from '../stores/translationStore';
import StatusIcon from './statusIcon';
import { TiBackspaceOutline } from 'solid-icons/ti';

interface IInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onInput'> {
    label?: string;
    edit?: boolean;
    search?: boolean;
    icon?: JSX.Element | string;
    ref?: Ref<HTMLInputElement>;
    initialValue?: string | number;
    resetCallback?: () => void;
    onInputCallback?: (value: string) => void;
    onInput?: (e: InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => void;
    onEnterFn?: () => void;
    onMouseDownFn?: () => void;
    "data-key"?: string;
    validity?: boolean;
    tooltip?: string;
    didSucceed?: boolean;
    didFail?: boolean;
    isLoading?: boolean;
}

//see accountsettings for example usage with data
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
// didSucceed={data() || didLoad()}
// didFail={!!error()}
// tooltip={"Type your name here"}
// isLoading={isLoading()}
// ></Input>

// type InputState = "button" | "check" | "cross" | "edit" | "loading" | "none"

export const Input: Component<IInputProps> = (
    props,
) => {
    const hasInitialValue = !!props.initialValue || false
    const [hasValue, setHasValue] = createSignal(hasInitialValue);
    const [isEdited, setIsEdited] = createSignal(false);
    const [hasFocus, setHasFocus] = createSignal(false);

    const id = props.id || "input" + uuid();

    let editRef!: SVGSVGElement;
    let inputRef!: HTMLInputElement

    const [delayedSuccess, setDelayedSuccess] = createSignal(false)
    const [delayedFailure, setDelayedFailure] = createSignal(false)
    const [delayedLoading, setDelayedLoading] = createSignal(false)


    createEffect(()=>{
        if(props.didSucceed){setDelayedSuccess(true)
            delayStateChange(()=>{setDelayedSuccess(false)}, 1000)
        }
    })

    createEffect(()=>{
        if(props.didFail){setDelayedFailure(true)
            delayStateChange(()=>{setDelayedFailure(false)}, 1000)
        }
    })

    createEffect(()=>{
        if(props.isLoading)setDelayedLoading(true)
        if(!props.isLoading && delayedLoading())delayStateChange(()=>{setDelayedLoading(false)}, 1000)
    })

    createEffect(() => {
        if(inputRef && props.disabled){
            inputRef.onclick = (e) => {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        if(inputRef.value === props.initialValue){
            setIsEdited(false)
        }        
    });

    return (
        <span
            has-label={!!props.label}
            has-edit={props.edit}
            has-search={props.search}
            has-icon={!!props.icon}
            has-reset={!!props.resetCallback}
            is-edited={isEdited()}
            has-value={hasValue()}
            has-validity={props.validity}
            has-focus={hasFocus()}
            class={cx(css.inputContainer)}
            // class={cx(css.inputContainer, !!props.tooltip ? "tooltip": "")} doesn't make sense, keeping in case something breaks
            data-tooltip={!!props.tooltip ? t(props.tooltip) : null }
            >
            
            <input
                {...props}
                id={id}
                value={props.initialValue || ""}
                class={cx(css.input, props.class, )}
                
                style={props.style}
                ref={mergeRefs(props.ref, el => (inputRef = el))}
                data-key={props["data-key"]}
                onInput={(e) => {
                    if(props.onInput)props.onInput(e as InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement })
                    if(props.onInputCallback)props.onInputCallback(e.currentTarget.value)
                    if(e.currentTarget.value.length > 0)setHasValue(true)
                    if(e.currentTarget.value.length < 1)setHasValue(false)
                    if(props.initialValue !== e.currentTarget.value)setIsEdited(true)
                    if(props.initialValue === e.currentTarget.value)setIsEdited(false)
                    if(props.initialValue === undefined && e.currentTarget.value === "")setIsEdited(false)
                }}
                onFocus={() => {setHasFocus(true)}}
                onBlur={() => {setHasFocus(false)}}
                onMouseDown={() => {
                    if (props.onMouseDownFn) {
                        props.onMouseDownFn();
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && props.onEnterFn) {
                        props.onEnterFn();
                    }
                }}
                disabled={props.disabled}
            />
            {props.label && <label for={id}>{props.label}</label>}
            
            

            <StatusIcon
                class={cx(css.statusIcon, "relative")}
                size={22}
                triggerCheck={props.didSucceed || false} 
                triggerCross={props.didFail || false}
                loading={props.isLoading || false} 
                >
                {props.edit && <FiEdit3 ref={editRef} color={"hsla(var(--r-primary),0.5)"} edit-icon size={22} 
                opacity={props.edit && !hasFocus() && !isEdited() && !props.disabled && !delayedLoading() ? 1 : 0}/>}
                
                {props.search && <FiSearch ref={editRef} color={"hsla(var(--r-primary),0.5)"} edit-icon size={22} 
                opacity={props.search && !hasFocus() && !isEdited() && !props.disabled && !delayedLoading() ? 1 : 0}/>}
                
                {props.icon && props.icon}
                {/* <FaSolidCheck ref={checkRef} check-icon size={22} opacity={0}/> */}
            </StatusIcon>

            

            <button
                style={{"opacity": 
                    props.resetCallback &&
                    isEdited() &&
                    !delayedSuccess() &&
                    !delayedFailure() &&
                    !props.isLoading
                    ? 1 : 0 }}
                class={cx("flex center")}
                onMouseDown={(e)=>{ //use onMouseDown instead of onClick to prevent focusing button
                    e.preventDefault()
                    changeStyle(e.target as HTMLElement, "bounceSVGleft", 200)

                    if(props.resetCallback && isEdited())props.resetCallback()

                    if(inputRef){
                        setIsEdited(false)
                        inputRef.value = props.initialValue?.toString() || ""
                        inputRef.focus()
                        inputRef.dispatchEvent(new Event("input", { bubbles: true }))//when resetting, simulate input to trigger onInput
                    }
                }}
                >
                    <TiBackspaceOutline class="noClick" />
            </button>
            
        </span>
    );
};
