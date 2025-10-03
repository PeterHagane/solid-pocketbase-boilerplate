import { DropdownMenuRootProps, DropdownMenu as KDropdownMenu } from '@kobalte/core/dropdown-menu';
import { createEffect, createSignal, JSX } from 'solid-js';
import './dropdown.module.scss';
import cx from 'classnames';
import css from './dropdown.module.scss';
import { changeStyle, changeStyleById, delayStateChange } from '../../utils/Utils';

interface IDropdownMenuProps extends DropdownMenuRootProps {
	children?: JSX.Element | JSX.Element[];
	class?: string;
	trigger?: JSX.Element;
	triggerId?: string,
	closeOnSelect?: boolean
	placement?: 'top' | 'bottom' | 'left' | 'right' | "bottom-start" | "bottom-end" | "top-start" | "top-end" | "left-start" | "left-end" | "right-start" | "right-end";
	isOpen?: boolean;
}

export const DropdownMenu = (
	_props: IDropdownMenuProps
) => {
	const [open, setOpen] = createSignal(false);
	const props = Object.assign( _props, { closeOnSelect: true })

	createEffect(() => {
		props.isOpen && setOpen(props.isOpen)
	})

	return (
		<KDropdownMenu
			placement={props.placement || 'bottom-end'}
			open={open()}
			onOpenChange={() => {
				changeStyle(
					document.getElementById(_props.triggerId ?? '') as HTMLElement,
					!open() ? 'bungeeChild' : 'bounceChild',
					200,
				);
				if (open()) {
					delayStateChange(() => setOpen(!open()), 200);
					changeStyleById('dropDownContent', 'stagger', 200);
					changeStyleById('dropDownContent', 'reverse', 200);
				} else {
					setOpen(!open());
					changeStyleById('dropDownContent', 'stagger', 200);
				}
			}}
		>
			{_props.trigger && <KDropdownMenu.Trigger class={cx(open() ? css.bgOpen : '', _props.class)}>
				{_props.trigger}
			</KDropdownMenu.Trigger>}
			<KDropdownMenu.Portal>
				<KDropdownMenu.Content
					class={cx('flex column gap padding rounding', css.dropdownContent)}
					id="dropDownContent"
				>
					{!Array.isArray(props.children) && props.children}
					{Array.isArray(props.children) && props.children.map((c, index) => {
						return (
							<KDropdownMenu.Item closeOnSelect={_props.closeOnSelect} style={`--i: ${index + 1}`}>
								{c}
							</KDropdownMenu.Item>
						);
					})}
				</KDropdownMenu.Content>
			</KDropdownMenu.Portal>
		</KDropdownMenu>
	);
};
