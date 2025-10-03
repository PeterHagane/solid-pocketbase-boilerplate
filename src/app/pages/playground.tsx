import { FaRegularChessKing } from "solid-icons/fa";
import { createEffect, createSignal, Match, Switch } from "solid-js";
import StatusIcon from "../components/statusIcon";
import { isMobile } from "../../utils/Utils";
// import yahooFinance from "yahoo-finance2";
import { userState } from "../stores/pocketBase";
import {
    useQuery,
  } from '@tanstack/solid-query'

// type StockType = Awaited<ReturnType<typeof yahooFinance.quote>>
// const quoteClient = hc<QuoteType>("/")
// const protectedClient = hc<ProtectedStockType>("/")

export const Playground = () => {
    const [check, toggleCheck] = createSignal<boolean>(false);
    const [cross, toggleCross] = createSignal<boolean>(false);
    const [loading, toggleLoading] = createSignal<boolean>(false);
    // const [error, setError] = createSignal<string>();

    // const [protectedData, setProtectedData] = createSignal<InferResponseType<typeof protectedClient.api.protectedStock.$get>>();

    // const [quote, setQuote] = createSignal<InferResponseType<typeof quoteClient.api.quote[":symbol"]>>({}); //plain fetch
    // fetchQuote("GOOGL").then((data)=>{setData(data)});//plain fetch
    
    const quote = useQuery(fetchQuote("GOOGL"))


    createEffect(()=>{
        console.log(quote)
    })

    // fetchSecuredData().then((data)=>{setProtectedData(data)})

    return (
            <div class="flex center gap column page">
               Playground

                   <div>Home {isMobile() ? "Mobile" : "Desktop"} {navigator?.userAgent}</div>

                    
        
                    <button onclick={()=>toggleCheck(!check())} class={"flex center gap"}>check </button>
                    <button onclick={()=>toggleCross(!cross())}class={"flex center gap"}>cross </button>
                    <button onclick={()=>toggleLoading(!loading())}class={"flex center gap"}>load </button>
        
                    <StatusIcon
                        triggerCross={cross()}
                        triggerCheck={check()}
                        loading={loading()}
                    >
                        <FaRegularChessKing></FaRegularChessKing>
                    </StatusIcon>

                    <br/>
                    <br/>
                    <br/>
                    
                    <div>
                        <Switch>
                            <Match when={quote.data}>
                                Stock Data: {JSON.stringify(quote.data, null, 2)}
                            </Match>
                            <Match when={quote.error}>
                                Stock Data: Error fetching data
                            </Match>
                        </Switch>
                    </div>
                    
                    <br/>
                    
                    {/* <div>Protected Stock: {JSON.stringify(protectedData(), null, 2)}</div> */}

                    <br />

            </div>
    )
}

export default Playground;

//plain fetch
// const fetchQuote = async (symbol: string) => {
//     // const resp = await fetch("http://localhost:3000/api/test")
//     // const resp = await fetch("/api/test")
//     // const data = await resp.json();
//     const token = userState().userToken
//     if (!token) {
//         throw new Error('No auth token found')
//     }
//     const resp = await fetch(`/api/quote/${symbol}`,{
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//     // const resp = await quoteClient.api.quote[":symbol"].$get({ param: { symbol: symbol }}) 
//     const data = await resp.json();
//     return data
// }

const fetchQuote = (symbol: string) => { //for use in tanstack query
    const token = userState().userToken
    if (!token) {
        throw new Error('No auth token found')
    }
    const header = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return () => ({
        queryKey: [`quote`, symbol],
        queryFn: () => fetch(`/api/quote/${symbol}`, header).then(resp => resp.json())
    })
}

const fetchSecuredData = async () => {
    const token = userState().userToken
    if (!token) {
        throw new Error('No auth token found')
    }
    
    const resp = await fetch("/api/protectedStock",{
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const data = await resp.json();

    // const resp = await protectedClient.api.secured.stock.$get({
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // })
    // const data = await resp.json();
    return data
}