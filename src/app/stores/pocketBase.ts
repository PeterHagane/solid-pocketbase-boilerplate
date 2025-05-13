import PocketBase from 'pocketbase';
import { notify } from '../components/notify';
import { createSignal } from 'solid-js';
import { ILoginForm } from '../components/loginForm';
import { t } from './translationStore';
import { PocketSession } from './pocektBaseTypes';

export const pburl = 'https://haproco-crm.pockethost.io/'
export const pb = new PocketBase(pburl)

export const [userState, setUserState] = createSignal<Partial<PocketSession>>({
    user: pb.authStore.record,
    // email: pb.authStore.record?.email,
    userToken: pb.authStore.token,
    isLoading: false,
    isPendingChange: false,
    isError: undefined,
    isSignedIn: pb.authStore.isValid,
    isAdmin: false,
    pb: pb
})

pb.authStore.onChange((token, model) => {
        //trigger on authStore change
        setUserState((prev)=>{
            return {
                ...prev,
                avatar: model?.avatar,
                email: model?.email,
                user: model, //AKA pb.authStore.record
                userToken: token,
                isLoading: false,
                isPendingChange: false,
                isError: undefined,
                isSignedIn: pb.authStore.isValid,
                isAdmin: false,
                pb: pb
            }
        }
    )
}, true);

export const setIsAdmin = async (userId?: string) => {
    if (!userId) return false
    return await pb.collection('sysAdmins').getFirstListItem(`user.id = "${userId}"`).then(
        ()=>{
            setUserState((prev)=>{return {...prev, isAdmin: true}})
        }
    ).catch((e)=>{
        setUserState((prev)=>{return {...prev, isAdmin: false}})
        return e
    })
}

export const registerUser = async ({ username, password }: ILoginForm) => {
    setUserState({
        ...userState(),
        isLoading: true,
        isError: undefined
    })


    return await pb
        .collection("users")
        .create({
            username: username, password: password, passwordConfirm: password
        })
        .then(() => {
            setUserState({
                ...userState(),
                isLoading: false,
                user: pb.authStore.record,
                pb: pb
            })
            notify({ title: t(`User registered. You can sign in now.`), color: "hsla(var(--r-good), 0.6)", duration: 6000 })
            return true
        }).catch((e) => {
            setUserState({
                ...userState(),
                isLoading: false,
                isError: e
            })
            notify({ title: t(`Couldn't register user.`), color: "hsla(var(--r-danger), 1)", message: t(e.response.data.username.message), duration: 6000, dismissible: true })
            return false
        }
        )
}


export const signIn = async ({ username, password }: ILoginForm) => {
    setUserState({
        ...userState(),
        isLoading: true,
        isError: undefined,
        userToken: pb.authStore.token
    })
    return await pb
        .collection("users")
        .authWithPassword(username, password)
        .then(async (a) => {
            setIsAdmin(a.record.id)
            setUserState({
                ...userState(),
                user: a.record,
                isLoading: false,
                isError: undefined,
                isSignedIn: true,
                pb: pb,
                userToken: pb.authStore.token
            })
            notify({ title: `${t(`Signed in`)}. ${t(`Welcome`)}, ${username}`, color: "hsla(var(--r-good), 0.6)", duration: 6000 })
            return true
        }).catch((e) => {
            setUserState({
                ...userState(),
                isLoading: false,
                isError: e
            })
            notify({ title: t(`Couldn't sign in user.`), color: "hsla(var(--r-danger), 1)", message: t(userState().isError?.response.message), duration: 6000, dismissible: true })
            return false
        })
}

export const signOut = async () => {
    setUserState({
        ...userState(),
        user: null,
        isLoading: false,
        isError: undefined,
        isSignedIn: false,
        isAdmin: false,
        pb: pb,
        userToken: null
    })
    pb.authStore.clear()
    notify({ title: t(`Signed out`), color: "hsla(var(--r-good), 0.6)", duration: 6000 })
}


export const sendEmailChangeRequest = async (email: string) => {
    setUserState({
        ...userState(),
        isLoading: true,
        isError: undefined,
    })
    return await pb.collection('users').requestEmailChange(email)
    .then((r)=>{
        setUserState({
            ...userState(),
            isPendingChange: true,
            isLoading: false,
        })
        notify({ title: t("Success"), color: "hsla(var(--r-good), 0.6)", duration: 6000 })
    }).catch(
        (e)=>{
            setUserState({
                ...userState(),
                isLoading: false,
                isPendingChange: false,
                isError: e,
            })
            notify({
                title: t(`Couldn't send request`),
                color: "hsla(var(--r-danger), 1)",
                message: t(e.response.data?.newEmail?.message ? e.response.data.newEmail.message : e.response.message ? e.response.message : ""),
                duration: 6000,
                dismissible: true })
        }
    )
}

export const sendVerificationRequest = async (email: string) => {
    console.log("verifyUser")
    let promise = pb.collection('users').requestVerification(email) 
    return await setLoadingErrorThenAndCatch(
        promise,
        `${t("Verification email sent to")}: ${email}. ${t("Check your inbox")}.`,
        "Couldn't send verification email."
    )
}

export const updateRecord = async(record: string, recordId: string, data: any, successMsg?: string, errorMsg?: string )=>{
    let promise = pb.collection(record).update(recordId, data);
    // let response = await promise
    return setLoadingErrorThenAndCatch(
        promise,
        successMsg || "Success",
        errorMsg || "Error"
    )
}

export const updateCallback = async(callback:()=>Promise<any>, successMsg?: string, errorMsg?: string, successFunc?:()=>void, errorFunc?:()=>void)=>{
    let promise = callback()

    return setLoadingErrorThenAndCatch(
        promise,
        successMsg || "Success",
        errorMsg || "Error",
        successFunc,
        errorFunc
    )
}


export const setLoadingErrorThenAndCatch = async ( promise: Promise<any>, successMsg?: string, errorMsg?: string, successFunc?:()=>void, errorFunc?:()=>void) => {
    setUserState({
        ...userState(),
        isLoading: true,
        isError: undefined,
    })
    return promise.then(()=>{
        if(successFunc)successFunc()
        setUserState({
            ...userState(),
            isLoading: false,
            isError: undefined
        })
        notify({ title: t(successMsg || "Success"), color: "hsla(var(--r-good), 0.6)", duration: 6000 })
        // return true
    }).catch(
        (e)=>{
            if(errorFunc)errorFunc()
            setUserState({
                ...userState(),
                isLoading: false,
                isError: e,
            })
            notify({
                title: t(errorMsg || "Error"),
                color: "hsla(var(--r-danger), 0.6)",
                message: t(e.response.data?.newEmail?.message ? e.response.data.newEmail.message : e.response.message ? e.response.message : ""),
                duration: 6000,
                dismissible: true })
            // return false
        }
    );
}



export const subscribeAndCallback = async (collection: string, id: string, callback?: () => void) =>{
    const unsub = await pb.collection(collection).subscribe(id, function (e) {
        if(e.action === "update" && callback) {
            callback() 
            return unsub}
    })
}

export const subscribeUserChange = async(callback?: ()=>void) =>{
    const unsub = await pb.collection("users").subscribe(pb.authStore.record?.id || "", (e)=> {
        if(e.action === "update") { 
            // unsub()
            if(callback)callback()
        }
    })
    return unsub
}

export const authRefresh = async(successMsg?: string, errorMsg?: string)=>{
    setUserState({
        ...userState(),
        isPendingChange: true,
        isLoading: false,
        isError: undefined,
    })

    return await pb.collection('users').authRefresh().then(
        (a)=>{
            setUserState({
                ...userState(),
                user: a.record,
                email: a.record?.email,
                isLoading: false,
                isPendingChange: false,
                isError: undefined,
                isSignedIn: true,
                pb: pb,
                userToken: pb.authStore.token
            })
         successMsg && notify({ title: t(successMsg || "Success"), color: "hsla(var(--r-good), 0.6)", duration: 6000 })
         return a
        }
    ).catch(
        (e)=>{
            setUserState({
                ...userState(), 
                email: t("Reauthenticate to view changes"),
                isPendingChange: false,
                isLoading: false,
                isError: e
            })
            notify({
                title: t(errorMsg || "Log out and back in to see your changes."),
                color: "hsla(var(--r-danger), 1)",
                message: t(e.response.data?.newEmail?.message ? e.response.data.newEmail.message : e.response.message ? e.response.message : ""),
                duration: 6000,
                dismissible: true })

            return e
        }
    )

}