import { createEffect, createSignal, JSX, onCleanup } from 'solid-js';
// import cx from 'classnames';
import css from './dropdownInput.module.scss';
import { Portal } from 'solid-js/web';
// @ts-ignore some gobbledygook warning
import { OutsideClickHandler } from 'solid-outside-click-handler';
import { delayStateChange, changeStyleById, uuid } from '../../utils/Utils';
import { handleDropdownKeyDown } from '../../utils/tabbable';


interface IDropdownInputProps {
    children?: JSX.Element[];
    class?: string;
    trigger?: JSX.Element;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSelect?: (index: number) => void;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    closeOnSelect?: boolean;
}

//populated children => menu is open
//empty children array => menu is closed
export const DropdownInput = (props: IDropdownInputProps) => {
    const [tempChildren, setTempChildren] = createSignal<JSX.Element[]>([]);
    const [focusedIndex, setFocusedIndex] = createSignal<number>(-1);
    const [triggerWidth, setTriggerWidth] = createSignal<number>(0);

    // let containerRef: HTMLDivElement | undefined;
    let dropdownRef: HTMLDivElement | undefined;
    let triggerRef: HTMLDivElement | undefined;
    let itemRefs: HTMLDivElement[] = [];
    const id = "dropdownInputContent" + uuid();
    
    // Track trigger width changes with ResizeObserver
    createEffect(() => {
        if (triggerRef) {
            const resizeObserver = new ResizeObserver((entries) => {
                const entry = entries[0];
                if (entry) {    
                    setTriggerWidth(entry.contentRect.width);
                }
            });
            
            resizeObserver.observe(triggerRef);
            setTriggerWidth(triggerRef.clientWidth); // Set initial width
            
            onCleanup(() => {
                resizeObserver.disconnect();
            });
        }
    });

    createEffect(() => {
        if (props.children && props.children.length > 0) {
            changeStyleById(id, 'stagger', 200);
            setTempChildren(props.children);
            setFocusedIndex(-1); // Reset focus when new children are set
        }
    });

    createEffect(() => {
        if (props.children && props.children.length < 1) {
            delayStateChange(() => setTempChildren(props.children || []), 200);
            changeStyleById(id, 'stagger', 200);
            changeStyleById(id, 'reverse', 200);
            setFocusedIndex(-1); // Reset focus when closing
        }
    });

    // Handle keyboard navigation using external function
    const handleKeyDown = (e: KeyboardEvent) => {
        handleDropdownKeyDown(
            e,
            tempChildren(),
            itemRefs,
            focusedIndex,
            setFocusedIndex,
            props.onSelect,
            props.closeOnSelect,
            closeDropdown
        );
    };

    const closeDropdown = () => {
            delayStateChange(() => setTempChildren([]), 200);
            changeStyleById(id, 'stagger', 200);
            changeStyleById(id, 'reverse', 200);       
    };

    // Add event listener when dropdown has children
    createEffect(() => {
        if (tempChildren().length > 0) {
            document.addEventListener('keydown', handleKeyDown);
            onCleanup(() => {
                document.removeEventListener('keydown', handleKeyDown);
            });
        }
    });

    return (
        <>
            <div ref={triggerRef}>
                {props.trigger}
            </div>
            <Portal mount={triggerRef}>
                <OutsideClickHandler onOutsideClick={() => {
                    closeDropdown();
                }}>
                    <div 
                        ref={dropdownRef}
                        id={id}
                        class={css.dropdown}
                        style={{
                            "width": `${Math.max(0, triggerWidth() - 24)}px`,
                            "max-width": `${Math.max(0, triggerWidth() - 24)}px`
                        }}
                        >
                            {tempChildren().length > 0 && tempChildren().map((c, index) => {
                                return (<div
                                    style={{
                                            "--i": index + 1,
                                        }}
                                    tabindex="0"
                                    ref={(el) => itemRefs[index] = el}
                                    class={css.dropdownItem}
                                    data-focused={focusedIndex() === index}
                                    onClick={() => {
                                        props.onSelect?.(index);
                                        if (props.closeOnSelect !== false) {
                                            closeDropdown();
                                        }
                                    }}
                                    onFocusIn={() => setFocusedIndex(index)}
                                    >
                                    {c}
                                </div>)}
                            )}
                    </div>
                </OutsideClickHandler>
            </Portal>
        </>
    );
};

