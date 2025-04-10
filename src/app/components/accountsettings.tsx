import { getElementById, uuid } from "../../utils/Utils"
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { userState } from "../stores/pocketBase";
import { FiSave } from "solid-icons/fi";
import { createSignal } from "solid-js";
import { InputAssistant } from "./inputassistant";

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

    const isEdited =(key: string)=>{
        if(initialSettings[key as keyof IAccountSettings] !== settings()[key as keyof IAccountSettings])return true
        return false
    }

    const resetValue = (key: string, id: string)=>{
        setSettings((prev)=>{return {...prev,
            [key]: initialSettings[key as keyof IAccountSettings]
        }})
        const input = getElementById(id) as HTMLInputElement
        if(input)input.value = initialSettings[key as keyof IAccountSettings]
    }

    const focusById =(id: string)=>{
        const i = getElementById(id)
        if(i && i.focus)i.focus()
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
            <input
            data-editable  
            id={ids.userName} 
            type="text" 
            placeholder={""}
            data-key={"userName"}
            value={initialSettings.userName}
            >
            </input>
            <InputAssistant label labelId={ids.userName} labelValue={"Username"} edit reset={isEdited("userName")}
                resetCallback={
                    ()=>{
                        resetValue("userName", ids.userName)
                        focusById(ids.userName) //autofocus when clicking this input's bin
                    }
                }
            />

            <input
            data-editable  
            id={ids.phone} 
            type="text" 
            placeholder={""} 
            data-key={"phone"}
            value={initialSettings.phone}>
            </input>
            <InputAssistant label labelId={ids.phone} labelValue={"phone"} edit 
            reset={isEdited("phone")} resetCallback={
                ()=>{
                    resetValue("phone", ids.phone)
                    focusById(ids.phone) //autofocus when clicking this input's bin
                }
            }/>
            

            <button disabled={!anyEdited()} class={cx("flex center gap marginTop")} data-translate type="submit">Save<FiSave></FiSave></button>
    </form>
    )
}
