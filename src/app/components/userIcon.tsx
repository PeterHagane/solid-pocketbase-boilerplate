import { FiUserCheck, FiUserX } from "solid-icons/fi";
import css from "./userIcon.module.scss";
import cx from "classnames"
import { FaRegularChessKing } from "solid-icons/fa";
import { userState } from "../stores/pocketBase";
import { JSX } from "solid-js";

interface IUserIconProps extends JSX.HTMLAttributes<HTMLSpanElement> {
    isLoggedIn: boolean
}

export const UserIcon = (props: IUserIconProps) => {
    return (
        <span class={cx(css.userIcon)}>
            {userState().isAdmin && <FaRegularChessKing color="hsla(var(--r-good), 1)" />}
            {!userState().isAdmin && props.isLoggedIn && <FiUserCheck color="hsla(var(--r-primary), 1)" size={20} />}
            {!props.isLoggedIn && <FiUserX size={20} />}
        </span>
    )
}

export default UserIcon;

export function getInitials(fullName: string): string {
    if (!fullName) return "";
    // Split the full name into parts
    const nameParts = fullName.split(' ');
    // Extract the first letter of each part and convert to uppercase
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
}