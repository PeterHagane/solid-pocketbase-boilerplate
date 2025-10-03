import { userState } from "../stores/pocketBase"
import { fetchWithTimeout } from "../../utils/Utils"

export const fetchQuote = (symbol: string) => {
    const token = userState().userToken
    if (!token) {
        return
    }
    const header = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return () => fetchWithTimeout(`/api/quote/${symbol}`, header).then(resp => resp.json())
}