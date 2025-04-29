import { getElementById, uuid } from "../../utils/Utils"
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { userState } from "../stores/pocketBase";
import { FiSave } from "solid-icons/fi";
import { createSignal } from "solid-js";
import { Input } from "./input";
import { t } from "../stores/translationStore";


type IAccountSettings = {
    userName: string,
    phone: string
}

export const AccountSettings =()=>{
    const ids = {
        userName: "name" + uuid(),
        phone: "phone" + uuid(),
    }

    const initialSettings: IAccountSettings = {
        userName: userState().user?.username,
        phone:  userState().user?.username,
    }

    const [settings, setSettings] = createSignal<IAccountSettings>({...initialSettings})

    const anyEdited =()=>{
        let edited = false
        for (const [key, value] of Object.entries(settings())) {
            if(initialSettings[key as keyof IAccountSettings] !== value)edited = true
        }      
        return edited
    }

    // const isEdited =(key: string)=>{
    //     if(initialSettings[key as keyof IAccountSettings] !== settings()[key as keyof IAccountSettings])return true
    //     return false
    // }

    const resetValue = (key: string, id: string)=>{
        setSettings((prev)=>{return {...prev,
            [key]: initialSettings[key as keyof IAccountSettings]
        }})
        const input = getElementById(id) as HTMLInputElement
        if(input)input.value = initialSettings[key as keyof IAccountSettings]
    }



    return (
        <form class={cx("flex center start column gap-s form fullHeight", css.card)}
            onSubmit={(e) => { e.preventDefault() }}
            onInput={(e)=>{
                const t = e.target as HTMLInputElement
                const setting: string = t.getAttribute("data-key")!
                setSettings((prev)=>{return{...prev, [setting]: t.value}})
            }}
        >

        <Input 
            initialValue={initialSettings.userName}
            id={ids.userName} 
            edit
            label={t("Username")}
            data-key="userName"
            resetCallback={()=>{
                resetValue("userName", ids.userName)
            }}></Input>

            <button disabled={!anyEdited()} class={cx("flex center gap marginTop")} data-translate type="submit">Save<FiSave></FiSave></button>
    </form>
    )
}
