import { FiUserCheck, FiUserX } from "solid-icons/fi";
import css from "./profilePicture.module.scss";
import cx from "classnames"
import { FaRegularChessKing } from "solid-icons/fa";
import { userState } from "../stores/pocketBase";

export const ProfilePicture = (props: { isLoggedIn: boolean }) => {


    return (
        <span class={cx(css.profilePicture)}>
            {userState().isAdmin && <FaRegularChessKing color="hsla(var(--r-good), 1)" />}
            {!userState().isAdmin && props.isLoggedIn && <FiUserCheck color="hsla(var(--r-primary), 1)" size={20} />}
            {!props.isLoggedIn && <FiUserX size={20} />}
        </span>

    )
}

export default ProfilePicture;

export function getInitials(fullName: string): string {
    if (!fullName) return "";
    // Split the full name into parts
    const nameParts = fullName.split(' ');
    // Extract the first letter of each part and convert to uppercase
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
}