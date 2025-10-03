import { JSX } from "solid-js";

// External keyboard navigation handler
export const handleDropdownKeyDown = (
    e: KeyboardEvent,
    children: JSX.Element[],
    itemRefs: HTMLDivElement[],
    focusedIndex: () => number,
    setFocusedIndex: (value: number | ((prev: number) => number)) => void,
    onSelect?: (index: number) => void,
    closeOnSelect?: boolean,
    closeDropdown?: () => void
) => {
    if (children.length === 0) return;

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            setFocusedIndex(prev => {
                const next = prev < children.length - 1 ? prev + 1 : 0;
                // Focus the item container, not any nested interactive elements
                itemRefs[next]?.focus();
                return next;
            });
            break;
        case 'ArrowUp':
            e.preventDefault();
            setFocusedIndex(prev => {
                const next = prev > 0 ? prev - 1 : children.length - 1;
                // Focus the item container, not any nested interactive elements
                itemRefs[next]?.focus();
                return next;
            });
            break;
        case 'Tab':
            const activeElement = document.activeElement as HTMLElement;
            const currentItemIndex = itemRefs.findIndex(ref => ref?.contains(activeElement));
            
            if (currentItemIndex === -1) return; // Not in our dropdown
            
            const currentItem = itemRefs[currentItemIndex];
            const tabbableElements = currentItem?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as NodeListOf<HTMLElement>;
            
            if (e.shiftKey) {
                // Shift+Tab - go to previous tabbable element or previous item
                const currentTabbableIndex = Array.from(tabbableElements || []).findIndex(el => el === activeElement);
                
                if (currentTabbableIndex > 0) {
                    // Focus previous tabbable element in current item
                    e.preventDefault();
                    tabbableElements[currentTabbableIndex - 1]?.focus();
                } else {
                    // Go to previous dropdown item
                    e.preventDefault();
                    const prevIndex = currentItemIndex > 0 ? currentItemIndex - 1 : children.length - 1;
                    const prevItem = itemRefs[prevIndex];
                    const prevTabbables = prevItem?.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    ) as NodeListOf<HTMLElement>;
                    
                    if (prevTabbables && prevTabbables.length > 0) {
                        prevTabbables[prevTabbables.length - 1]?.focus(); // Focus last tabbable in previous item
                    } else {
                        prevItem?.focus(); // Focus the item container itself
                    }
                    setFocusedIndex(prevIndex);
                }
            } else {
                // Tab - go to next tabbable element or next item
                const currentTabbableIndex = Array.from(tabbableElements || []).findIndex(el => el === activeElement);
                
                if (activeElement === currentItem) {
                    // Currently on item container, focus first tabbable element if exists
                    if (tabbableElements && tabbableElements.length > 0) {
                        e.preventDefault();
                        tabbableElements[0]?.focus();
                    }
                } else if (currentTabbableIndex >= 0 && currentTabbableIndex < tabbableElements.length - 1) {
                    // Focus next tabbable element in current item
                    e.preventDefault();
                    tabbableElements[currentTabbableIndex + 1]?.focus();
                } else {
                    // Go to next dropdown item
                    e.preventDefault();
                    const nextIndex = currentItemIndex < children.length - 1 ? currentItemIndex + 1 : 0;
                    const nextItem = itemRefs[nextIndex];
                    const nextTabbables = nextItem?.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    ) as NodeListOf<HTMLElement>;
                    
                    if (nextTabbables && nextTabbables.length > 0) {
                        nextTabbables[0]?.focus(); // Focus first tabbable in next item
                    } else {
                        nextItem?.focus(); // Focus the item container itself
                    }
                    setFocusedIndex(nextIndex);
                }
            }
            break;
        case 'Enter':
            e.preventDefault();
            if (focusedIndex() >= 0) {
                onSelect?.(focusedIndex());
                // Close dropdown after selection (if closeOnSelect is not false)
                if (closeOnSelect !== false) {
                    closeDropdown?.();
                }
            }
            break;
        case 'Escape':
            e.preventDefault();
            closeDropdown?.();
            break;
    }
};