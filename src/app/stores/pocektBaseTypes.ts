import PocketBase, {AuthRecord} from 'pocketbase';

export type User = { //authRecord in pocketbase
    avatar: string
    collectionId: string
    collectionName: string
    created: Date,
    email: string
    emailVisibility: boolean
    id: string
    name: string
    updated: Date
    username: string
    verified: boolean
}


export type PocketSession = {
    // registerUser: ({ username, password }: ILoginForm) => Promise<boolean | void>
    // signIn: ({ username, password }: ILoginForm) => Promise<boolean | void>
    // signOut: () => void
    // adminSignIn: ({ username, password }: ILoginForm) => Promise<boolean | void>
    user: User | AuthRecord
    // email: string,
    pb: PocketBase
    isLoading: boolean
    isPendingChange: boolean
    isError: PocketError | undefined
    isSignedIn: boolean
    isAdmin: boolean
    userToken: string | null
}

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
