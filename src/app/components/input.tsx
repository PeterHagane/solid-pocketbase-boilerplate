import cx from 'classnames';
import css from './input.module.scss';
import { Component, createSignal, JSX } from 'solid-js';
import { TiBackspaceOutline } from 'solid-icons/ti';
import { FiEdit3 } from 'solid-icons/fi';
import { changeStyle, delayStateChange, getElementById, uuid } from '../../utils/Utils';

interface IInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    edit?: boolean;
    ref?: HTMLInputElement;
    initialValue?: string | number;
    resetCallback?: () => void;
    onInputCallback?: (value: string) => void;
    "data-key"?: string;
    validity?: boolean;    
}

export const Input: Component<IInputProps> = (
    props,
) => {
    const hasInitialValue = !!props.initialValue || false
    const [hasValue, setHasValue] = createSignal(hasInitialValue);
    const [isEdited, setIsEdited] = createSignal(false);
    const [hasFocus, setHasFocus] = createSignal(false);


    const id = props.id || uuid();

    return (
        <span
            has-label={!!props.label}
            has-edit={props.edit}
            has-reset={!!props.resetCallback}
            is-edited={isEdited()}
            has-value={hasValue()}
            has-validity={props.validity}

            class={cx(css.inputContainer)}>
            
            <input
                {...props}
                id={id}
                value={props.initialValue || ""}
                class={cx(css.input, props.class, "")}
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
            />

            {props.label && <label for={id}>{props.label}</label>}
            
            <FiEdit3 edit-icon size={22} opacity={(props.edit && !isEdited() && !hasFocus()) ? 1: 0}/>
            
            <button
                style={{"opacity": (props.resetCallback && isEdited()) ? 1 : 0}}
                class={cx("flex center")}
                onMouseDown={(e)=>{ //use onMouseDown instead of onClick to prevent focusing button
                    e.preventDefault()
                    changeStyle(e.target as HTMLElement, "bounceSVGleft", 200)
                    props.resetCallback!()
                    const input = getElementById(id) as HTMLInputElement
                    if(input){
                        input.value = props.initialValue?.toString() || ""
                        input.focus()
                        delayStateChange(()=>{
                            setIsEdited(false)
                            setHasValue(!!input.value)
                        }, 200)
                    }
                }}
                >
                    <TiBackspaceOutline class="noClick" />
            </button>
            
        </span>
    );
};