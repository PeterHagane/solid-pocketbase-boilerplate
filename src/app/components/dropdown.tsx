import { DropdownMenu as KDropdownMenu } from '@kobalte/core/dropdown-menu';
import { createSignal, JSX } from 'solid-js';
import './dropdown.module.scss';
import cx from 'classnames';
import css from './dropdown.module.scss';
import { changeStyle, changeStyleById, delayStateChange } from '../../utils/Utils';

export const DropdownMenu = (
	_props: { children?: JSX.Element | JSX.Element[]; class?: string; trigger?: JSX.Element; triggerId?: string, closeOnSelect?: boolean }
) => {
	const [open, setOpen] = createSignal(false);
	const props = Object.assign( _props, { closeOnSelect: true })

	return (
		<KDropdownMenu
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
			<KDropdownMenu.Trigger class={cx(open() ? css.bgOpen : '', _props.class)}>
				{_props.trigger}
			</KDropdownMenu.Trigger>
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
