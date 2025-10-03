import { getElementById, uuid } from "../../utils/Utils"
import cx from "classnames"
import css from "./accountisverified.module.scss"
import { pb, userState } from "../stores/pocketBase";
import { FiSave } from "solid-icons/fi";
import { createEffect, createSignal } from "solid-js";
import { Input } from "./input";
import { t } from "../stores/translationStore";
import Loader from "./loader";
import usePBQuery from "../stores/hooks/usePocketBaseQuery";


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

    const { fetch: updateUser, isFetching: isLoading, error, data, didFetch } = usePBQuery({
        queryFn: () =>  pb.
            collection("users").update(
                userState().user?.id || "", 
                settings()
            ),
        successMessage: 'User updated',
        errorMessage: 'Failed to update user',
        manual: true,
      })

    createEffect(() => {
        if(data() || error()) setInitialSettings({
            username: userState().user?.username,
            name:  userState().user?.name,
        })

        // console.log(data(), error(), isUpdatingUser())
    })


    return (<>
        {isLoading() && <Loader></Loader>}
        <form class={cx("flex center start column gap-s form fullHeight", css.card)}
            onSubmit={(e) => {
                e.preventDefault()
                updateUser()
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
            didSucceed={settings().username !== initialSettings().username && !!data()}
            didFail={settings().username !== initialSettings().username && !!error()}
            tooltip={
                (userState().user?.email === ("") ||
                userState().user?.email === undefined) ?
                t("Register email to change username") : undefined}
            // isLoading={isLoading()}
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
            didSucceed={didFetch()}
            didFail={!!error()}
            // isLoading={isLoading()}
            ></Input>

            <button disabled={!anyEdited()} class={cx("flex center gap marginTop")} data-translate type="submit">Save<FiSave></FiSave></button>
    </form>


    </>
    )
}
