import { DropdownMenu } from "../dropdown";
import cx from "classnames";
import css from "./header.module.scss";
import { IoMoonOutline, IoSunnyOutline } from "solid-icons/io";
import { changeStyle, isMobile } from "../../../utils/Utils";
import { saveTheme } from "../../stores/themesStore";
import { signOut, userState } from "../../stores/pocketBase";
import { useNavigate } from "@solidjs/router";
import { LanguageDropdown } from "../languageDropdown";
import { Logo } from "../logo";
import ProfilePicture from "../profilePicture";
import { screenSize } from "../../stores/settingsStore";

export const Header = (_props: any) => {
    const navigate = useNavigate();


    return <nav class={cx("flex row center gap scrollX", css.nav, _props.class, !isMobile() ? "desktopScrollbar" : "")}>
        <Logo class={css.logo}
            showId={false}
            showName={!(screenSize().width < 600 || isMobile())}
            onClick={() => { navigate("/") }} />
        <div class="flexGrow" />
        {/* 
        {userState().isSignedIn && <button class="flex row center gap "
            onClick={() => {
                navigate("/")
            }}
            data-translate
        >Home</button>}
        {userState().isSignedIn && <button class="flex row center gap "
            onClick={() => {
                navigate("/admin")
                console.log(userState().pb)

            }}
            data-translate
        >Admin</button>} */}

        <LanguageDropdown class={css.flexEnd} />

        <DropdownMenu
            triggerId="dropdownThemeSpan"
            trigger={
                <span class="flex row center" id="dropdownThemeSpan">
                    <IoSunnyOutline size={20} /><IoMoonOutline size={16} class="fill" />
                </span>}>
            <button class="flex row center gap" onClick={
                (e) => {
                    saveTheme("Light")
                    changeStyle(e.currentTarget as HTMLElement, "bounceSVG", 200)
                }
            }
                data-translate
            >Light mode<IoSunnyOutline size={20} class="marginLeft" />
            </button>

            <button class="flex row center gap " onClick={
                (e) => {
                    saveTheme("Dark")
                    changeStyle(e.currentTarget as HTMLElement, "bounceSVG", 200)
                }
            } data-translate
            >Dark mode<IoMoonOutline size={16} class="marginLeft fill" />
            </button>
        </DropdownMenu>

        <DropdownMenu
            triggerId="dropdownUserSpan"
            trigger={
                <span class="flex row center gap" id="dropdownUserSpan">
                    {userState().user?.username}
                    <ProfilePicture isLoggedIn={userState().isSignedIn ?? false} />
                </span>
            }
        >
            {userState().isSignedIn && <button class="flex row center gap" onClick={() => { navigate("/profile") }} data-translate>Profile</button>}

            {userState().isSignedIn && <button class="flex row center gap "
                onClick={() => {
                    userState().pb?.authStore.clear()
                    signOut()
                    navigate("/login")
                }}
                data-translate>
                Sign out
            </button>
            }

            {!userState().isSignedIn && <button class="flex row center gap"
                onClick={() => { navigate("/login") }} data-translate>
                Login
            </button>
            }


        </DropdownMenu>
    </nav>;
};

export default Header;

