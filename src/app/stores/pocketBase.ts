import PocketBase from 'pocketbase';
import { notify } from '../components/notify';
import { createSignal } from 'solid-js';
import { ILoginForm } from '../components/loginForm';
import { t } from './translationStore';


const url = 'https://haproco.pockethost.io/'
export const pb: PocketBase = new PocketBase(url)

type PocketError = {
    response: PocketResponse
}

type PocketResponse = {
    code: number
    message: string
    data: {
        username: {
            code: string
            message: string
        }
    }

}


export type PocketSession = {
    registerUser: ({ username, password }: ILoginForm) => Promise<boolean | void>
    signIn: ({ username, password }: ILoginForm) => Promise<boolean | void>
    signOut: () => void
    adminSignIn: ({ username, password }: ILoginForm) => Promise<boolean | void>
    user: {
        [key: string]: any;
    } | null
    pb: PocketBase
    isLoading: boolean
    isError: PocketError | undefined
    isSignedIn: boolean
    isAdmin: boolean
    userToken: string | null
}

const getIsAdmin = async (userId?: string) => {
    if (!userId) return false
    try {
        const record = await pb.collection('sysAdmins').getFirstListItem(`userId = "${userId}"`)
        if (record.isAdmin) return true
        if (!record || !record.isAdmin) return false
    } catch (error) {
        return false
    }
}


export const [userState, setUserState] = createSignal<Partial<PocketSession>>({
    user: pb.authStore.record,
    userToken: pb.authStore.token,
    isLoading: false,
    isError: undefined,
    isSignedIn: pb.authStore.isValid,
    isAdmin: await getIsAdmin(pb.authStore.record?.id) || false,
    pb: pb
})



export const registerUser = async ({ username, password }: ILoginForm) => {
    setUserState({
        ...userState(),
        isLoading: true,
        isError: undefined
    })


    return await pb
        .collection("users")
        .create({
            username, password, passwordConfirm: password
        })
        .then(() => {
            setUserState({
                ...userState(),
                isLoading: false,
                user: pb.authStore.record,
                pb: pb
            })
            notify({ title: t(`User registered. You can sign in now.`), color: "hsla(var(--r-good), 1)", duration: 6000 })
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
        .then(async () => {
            const isAdmin = await getIsAdmin(pb.authStore.record?.id)
            setUserState({
                ...userState(),
                user: pb.authStore.record,
                isLoading: false,
                isError: undefined,
                isSignedIn: true,
                isAdmin: isAdmin,
                pb: pb,
                userToken: pb.authStore.token

            })
            notify({ title: `${t(`Signed in`)}. ${t(`Welcome`)}, ${username}`, color: "hsla(var(--r-good), 1)", duration: 6000 })
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
    notify({ title: t(`Signed out`), color: "var(--good)", duration: 6000 })
}

