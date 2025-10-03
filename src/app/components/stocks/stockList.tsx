import cx from "classnames"
import css from "./stockCard.module.scss"
import { Component, JSX } from "solid-js"
import { ISearchQuote } from "./stockSearch"
import { useStockStore } from "../../stores/stockStore"

interface IStockListProps extends JSX.HTMLAttributes<HTMLDivElement>, ISearchQuote {
}

export const StockList: Component<IStockListProps> = (props) => {
    const { removeQuote, stockStore } = useStockStore()

    
    return <div style={props.style} {...props} class={cx(css.container, "flex row gap")} >
                    {stockStore().map(quote => (
                <div>{quote.symbol} <button onclick={() => removeQuote(quote.symbol)}>Remove</button></div>
            ))}
    </div>

}

export default StockList


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