import { pb } from "../stores/pocketBase";

export const verifyEmail = async (email: string) => {
    return await pb.collection('users').requestVerification(email);
}

export const requestEmailChange = async (email: string) => {
    return await pb.collection('users').requestEmailChange(email);
}