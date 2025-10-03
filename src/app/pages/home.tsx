
import cx from "classnames"
import { StockView } from "../components/stocks/stockView";
import { StockSearch, ISearchQuote } from "../components/stocks/stockSearch";
import { useStockStore } from "../stores/stockStore";

export const Home = () => {
    const handleStockSelection = (quote: ISearchQuote) => {
        console.log("Stock selected:", quote.shortname, "-", quote.symbol);
        // TODO: Integrate with StockView to automatically load the selected stock
    };
    
    const { removeQuote, stockStore } = useStockStore()
    
    return (
        <div class={cx("flex column page")}>
            <StockSearch onSelectStock={handleStockSelection} />
            <br />
            <StockView />
            <br />
            <section class={cx("grid center")} max-col-count={2} min-col-size={"35ch"}>
                {stockStore().map(quote => (
                    <div class={cx("flex column shadow rounding gridCard")}>{quote.symbol}
                        <button onclick={() => removeQuote(quote.symbol)}>Remove</button>
                    </div>
                ))}
            </section>

        </div>
    )
}

export default Home;

