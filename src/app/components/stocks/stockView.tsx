import css from "./stockView.module.scss";
import cx from "classnames";
import { Component, createEffect, createSignal, createMemo, JSX } from "solid-js";
import { Input } from "../input";
import { debounce } from "@solid-primitives/scheduled";
import { useQuery } from "@tanstack/solid-query";
import { notify } from "../notify";
import { t } from "../../stores/translationStore";
import { fetchQuote } from "../../queries/stockQueries";
import { DropdownInput } from "../dropdownInput";
import StockViewCard from "./stockViewCard";


interface IStockView {
    onClick?: () => void, 
    class?: string,
    showName?: boolean,
    showId?: boolean 
}

export const [quotes, setQuotes] = createSignal<IQuote[]>([])

export const StockView: Component<IStockView> = (props) => {
    const [symbolSearch, setSymbolSearch] = createSignal<string>("")

    let inputRef!: HTMLInputElement;

    const trigger = debounce((callback: () => void) => callback(), 333);

    const quote = useQuery(() => ({
        queryKey: ['quote', symbolSearch()],
        queryFn: fetchQuote(symbolSearch()),
        enabled: symbolSearch().length > 0,
    }));

    createEffect(() => {
        if(quote.error) {
            notify({
                title: `${t("Could not find stock data for")} ${symbolSearch()}`,
                color: "hsla(var(--r-error), 0.5)",
                textColor: "hsla(var(--r-text-primary), 1)",
                duration: 2500,
                dismissible: true,
            })
        }
    })

    const dropdownResults = createMemo(() => {
        if (quote.isFetching) {
            return [<div class="flex row center gap"><div style={{height: "14px", width: "14px"}} class="loader"></div><div>Loading...</div></div>];
        }

        if(symbolSearch() === "") {
            return [];
        }

        let data: IQuote[] = [quote.data as IQuote];

        let results: JSX.Element[] = data.map((quote) => (
            <StockViewCard quote={quote} />
        ));
        
        if(results.length === 0) {
            results.push(<div>No result.</div>);
        }

        return results;
    });

    const handleSelectStock = () => {
        // For single result, just close dropdown
        // Could extend this for multiple results in the future
    };

    return <div class={cx(css.container, props.class)}>
        <DropdownInput
            placement="bottom"
            onSelect={handleSelectStock}
            closeOnSelect={false}
            trigger={        
                <Input
                ref={inputRef}
                initialValue={""}
                onMouseDownFn={() => {
                    if(symbolSearch().length > 0) {
                        trigger(()=>quote.refetch())
                    }
                }}
                onEnterFn={() => {
                    trigger(()=>quote.refetch())
                }}
                onInput={(e) => {
                    trigger(()=>setSymbolSearch(e.target.value))
                }} 
                label={t("Ticker/symbol, e.g. TSLA")}
                placeholder=""
                resetCallback={() => {
                    setSymbolSearch("");
                }} 
                search
                isLoading={quote.isLoading}
            />
        }
        >
            {dropdownResults()}
        </DropdownInput>
    </div>
}





export interface IQuote {
    language: string;
    region: string;
    quoteType: string;
    typeDisp: string;
    quoteSourceName: string;
    triggerable: boolean;
    customPriceAlertConfidence: string;
    currency: string;
    tradeable: boolean;
   cryptoTradeable: boolean;
    longName: string;
    corporateActions: any[];
    postMarketTime: string;
    regularMarketTime: string;
    exchange: string;
    messageBoardId: string;
    exchangeTimezoneName: string;
    exchangeTimezoneShortName: string;
    gmtOffSetMilliseconds: number;
    market: string;
    esgPopulated: boolean;
    shortName: string;
    regularMarketChangePercent: number;
    regularMarketPrice: number;
    hasPrePostMarketData: boolean;
    firstTradeDateMilliseconds: string;
    priceHint: number;
    postMarketChangePercent: number;
    marketState: string;
    postMarketPrice: number;
    postMarketChange: number;
    regularMarketChange: number;
    regularMarketDayHigh: number;
    regularMarketDayRange: {
        low: number;
        high: number;
    };
    regularMarketDayLow: number;
    regularMarketVolume: number;
    regularMarketPreviousClose: number;
    bid: number;
    ask: number;
    bidSize: number;
    askSize: number;
    fullExchangeName: string;
    financialCurrency: string;
    regularMarketOpen: number;
    averageDailyVolume3Month: number;
    averageDailyVolume10Day: number;
    fiftyTwoWeekLowChange: number;
    fiftyTwoWeekLowChangePercent: number;
    fiftyTwoWeekRange: {
        low: number;
        high: number;
    };
    fiftyTwoWeekHighChange: number;
    fiftyTwoWeekHighChangePercent: number;
    fiftyTwoWeekLow: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekChangePercent: number;
    dividendDate: string;
    earningsTimestamp: string;
    earningsTimestampStart: string;
    earningsTimestampEnd: string;
    earningsCallTimestampStart: number;
    earningsCallTimestampEnd: number;
    isEarningsDateEstimate: boolean;
    trailingAnnualDividendRate: number;
    trailingPE: number;
    dividendRate: number;
    trailingAnnualDividendYield: number;
    dividendYield: number;
    epsTrailingTwelveMonths: number;
    epsForward: number;
    epsCurrentYear: number;
    priceEpsCurrentYear: number;
    sharesOutstanding: number;
    bookValue: number;
    fiftyDayAverage: number;
    fiftyDayAverageChange: number;
    fiftyDayAverageChangePercent: number;
    twoHundredDayAverage: number;
    twoHundredDayAverageChange: number;
    twoHundredDayAverageChangePercent: number;
    marketCap: number;
    forwardPE: number;
    priceToBook: number;
    sourceInterval: number;
    exchangeDataDelayedBy: number;
    averageAnalystRating: string;
    symbol: string;
}