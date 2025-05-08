import { delayStateChange, getElementById, uuid } from "../../utils/Utils"
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { pb, updateCallback, userState } from "../stores/pocketBase";
import { FiSave } from "solid-icons/fi";
import { createSignal } from "solid-js";
import { Input } from "./input";
import { t } from "../stores/translationStore";
import Loader from "./loader";


type IAccountSettings = {
    username: string,
    name: string
}

export const AccountSettings =()=>{
    const ids = {
        username: "username" + uuid(),
        name: "name" + uuid(),
    }

    const [initialSettings, setInitialSettings] = createSignal<IAccountSettings>(
        {
            username: userState().user?.username,
            name:  userState().user?.name,
        }
    )
    const [settings, setSettings] = createSignal<IAccountSettings>({...initialSettings()})
    const [isLoading, setIsLoading] = createSignal(false)
    const [hasUpdated, setHasUpdated] = createSignal(false)

    const anyEdited =()=>{
        let edited = false
        for (const [key, value] of Object.entries(settings())) {
            if(initialSettings()[key as keyof IAccountSettings] !== value)edited = true
        }      
        return edited
    }

    // const isEdited =(key: string)=>{
    //     if(initialSettings[key as keyof IAccountSettings] !== settings()[key as keyof IAccountSettings])return true
    //     return false
    // }

    const resetValue = (key: string, id: string)=>{
        setSettings((prev)=>{return {...prev,
            [key]: initialSettings()[key as keyof IAccountSettings]
        }})
        const input = getElementById(id) as HTMLInputElement
        if(input)input.value = initialSettings()[key as keyof IAccountSettings]
    }



    return (<>
        {isLoading() && <Loader></Loader>}
        <form class={cx("flex center start column gap-s form fullHeight", css.card)}
            onSubmit={(e) => {
                setIsLoading(true)
                e.preventDefault()
                updateCallback(
                    ()=>{
                        return pb.collection("users").update(
                            userState().user?.id || "", 
                            settings()
                        )
                    },
                    t("Settings updated")
                ).then(()=>{
                    setHasUpdated(true)
                    delayStateChange(()=>{
                        setHasUpdated(false)
                    }, 1000)
                    setInitialSettings({
                        username: userState().user?.username,
                        name:  userState().user?.name,
                    })
                    setIsLoading(false)
                })
                
            }}
            onInput={(e)=>{
                const t = e.target as HTMLInputElement
                const setting: string = t.getAttribute("data-key")!
                setSettings((prev)=>{return{...prev, [setting]: t.value}})
            }}
        >

        <Input
            disabled={
                userState().user?.email === ("") ||
                userState().user?.email === undefined 
            }
            initialValue={initialSettings().username}
            id={ids.username} 
            edit
            label={t("Username")}
            data-key="username"
            resetCallback={()=>{
                resetValue("username", ids.username)
            }}
            wiggle={settings().username !== initialSettings().username && hasUpdated()}
            tooltip={
                (userState().user?.email === ("") ||
                userState().user?.email === undefined) ?
                t("Register email to change username") : undefined}
            >
            </Input>
        
        <Input 
            initialValue={initialSettings().name}
            id={ids.name} 
            edit
            label={t("Name")}
            data-key="name"
            resetCallback={()=>{
                resetValue("name", ids.name)
            }}
            wiggle={settings().name !== initialSettings().name && hasUpdated()}></Input>

            <button disabled={!anyEdited()} class={cx("flex center gap marginTop")} data-translate type="submit">Save<FiSave></FiSave></button>
    </form>


    </>
    )
}
