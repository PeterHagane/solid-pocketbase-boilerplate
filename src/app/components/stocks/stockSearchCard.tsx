import cx from "classnames"
import css from "./stockSearchCard.module.scss"
import { Component, JSX } from "solid-js"
import { ISearchQuote } from "./stockSearch"
import { AiOutlineMinus, AiOutlinePlus } from "solid-icons/ai"
import {  useStockStore } from "../../stores/stockStore"
import { useQuery } from "@tanstack/solid-query"
import { fetchQuote } from "../../queries/stockQueries"
import { IQuote } from "./stockView"
// import { addQuoteBySymbol } from "../stores/stockStore"

interface ICardProps extends JSX.HTMLAttributes<HTMLDivElement>, ISearchQuote {
}

const getColor = (type: string) => {
    if(type === "Equity") return css.equity
    if(type === "Cryptocurrency") return css.crypto
    if(type === "ETF") return css.etf
    if(type === "Option") return css.option
    return ""
}

export const StockSearchCard: Component<ICardProps> = (props) => {
    const { addQuote, persistStockStore, removeQuote, stockStore } = useStockStore()

    const quote = useQuery(() => ({
        queryKey: ['quote', props.symbol],
        queryFn: fetchQuote(props.symbol),
        enabled: false,
    }));

    const getButtonMode = () => {
        const found = stockStore().some(q => q.symbol === props.symbol)
        // if(quote.isFetching) return "loading"
        if(found) return "remove"
        if(!found) return "add"
        return "none"
    }

    return <div style={props.style} {...props} class={cx(css.container, "flex column gap")} >
        
        <div class={cx(css.header, "flex row gap")}>
            
            <button 
                onclick={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    console.log(props.symbol)
                }}
                class={cx(css.symbol, "flex row center gap")}><span>{props.symbol}</span></button>
            
            
            <div class={cx(css.buttons, "marginLeft relative")}>
                
            {getButtonMode() === "add" &&
                <button
                    onclick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        quote.refetch().then(() => {
                            if(quote.data){
                                addQuote(quote.data as IQuote)
                                persistStockStore()
                            }
                        })
                    }}
                class={cx(css.add, "flex row center gap absolute")}><AiOutlinePlus /></button>}

            {getButtonMode() === "remove" &&
                <button
                    onclick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        quote.refetch().then(() => {
                            if(quote.data){
                                removeQuote(props.symbol)
                                persistStockStore()
                            }
                        })
                    }}
                class={cx(css.add, "flex row center gap absolute")}><AiOutlineMinus /></button>}
        {quote.isFetching &&
            <button style={{"padding-left": "8px", "padding-right": "8px"}}
            class={cx(css.add, "flex row center gap absolute")}><div class={"loader"} style={{width: "12px", height: "12px"}}></div></button>}

</div>

        </div>



        <div class={cx(css.content, "flex row gap")}>
            <div class={css.longName}>{props.shortname}</div>
            
            <div class={cx(css.typeDisp, getColor(props.typeDisp), "marginLeft")}>{props.typeDisp},</div>
            <div class={cx(css.exchange)}>{props.exchange}</div>

        </div>
    </div>

}

export default StockSearchCard


// exchange: string;
// shortname: string;
// quoteType: string;
// symbol: string;
// index: string;
// score: number;
// typeDisp: string;
// longname: string;
// exchDisp: string;
// sector?: string;
// sectorDisp?: string;
// industry?: string;
// industryDisp?: string;
// dispSecIndFlag?: boolean;
// isYahooFinance: boolean;
// name?: string;
// permalink?: string;