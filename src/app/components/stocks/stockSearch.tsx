import css from "./stockSearch.module.scss";
import cx from "classnames";
import { Component, createEffect, createSignal, JSX, createMemo } from "solid-js";
import { userState } from "../../stores/pocketBase";
import { Input } from "../input";
import { debounce } from "@solid-primitives/scheduled";
import { useQuery } from "@tanstack/solid-query";
import { notify } from "../notify";
import { t } from "../../stores/translationStore";
import { DropdownInput } from "../dropdownInput";import StockSearchCard from "./stockSearchCard";
;

interface IStockView {
    onClick?: () => void, 
    onSelectStock?: (quote: ISearchQuote) => void,
    class?: string,
    showName?: boolean,
    showId?: boolean 
}

export const StockSearch: Component<IStockView> = (props) => {
    const [symbolSearch, setSymbolSearch] = createSignal<string>("")
    const [searchQuotes, setSearchQuotes] = createSignal<ISearchQuote[]>([]);
    let inputRef!: HTMLInputElement;

    const trigger = debounce((callback: () => void) => callback(), 333);


    const search = useQuery(() => ({
        queryKey: ['search', symbolSearch()],
        queryFn: fetchSearch(symbolSearch()),
        enabled: symbolSearch().length > 0,
    }));

    createEffect(() => {
        if(search.error || (Array.isArray(search.data?.quotes) && search.data?.quotes.length < 1)) {
            notify({
                title: `${t("No search results for")} ${symbolSearch()}`,
                color: "hsla(var(--r-error), 0.5)",
                textColor: "hsla(var(--r-text-primary), 1)",
                duration: 2500,
                dismissible: true,
            })
        }
    })

    const searchResults = createMemo(() => {
        if (search.isFetching) {
            setSearchQuotes([]);
            return [<div class="flex row center gap"><div style={{height: "14px", width: "14px"}} class="loader"></div><div >Loading...</div></div>];
        }

        if(symbolSearch() === "") {
            setSearchQuotes([]);
            return [];
        }

        const quotes = search.data?.quotes?.filter((quote: ISearchQuote) => quote.shortname) || [];
        setSearchQuotes(quotes);

        let results: JSX.Element[] = quotes.map((quote: ISearchQuote) => (
            <StockSearchCard {...quote} />
        ));
        
        if(results.length === 0) {
            results.push(<div>No results.</div>);
        }

        return results;
    });

    const handleSelectStock = (index: number) => {
        const quotes = searchQuotes();
        if (index >= 0 && index < quotes.length) {
            const selectedQuote = quotes[index];
            props.onSelectStock?.(selectedQuote);
            // setSymbolSearch("");  // Clear search after selection
        }
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
                        trigger(()=>search.refetch())
                    }
                }}
                onEnterFn={() => {
                    trigger(()=>search.refetch())
                }}
                onInput={(e) => {
                    trigger(()=>setSymbolSearch(e.target.value))
                }} 
                label={t("Search for tickers or companies")}
                placeholder=""
                resetCallback={() => setSymbolSearch("")} 
                search
                isLoading={search.isLoading}
            />
        }
        >
            {searchResults()}
        </DropdownInput>
    </div>
}

const fetchSearch = (symbol: string) => {
    const token = userState().userToken
    if (!token) {
        return
    }

    const header = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    const params = new URLSearchParams({
        q: symbol,
        quotesCount: '10',        // Limit number of quote results
        newsCount: '0',           // Disable news results
        enableFuzzyQuery: 'true', // Exact matching only
        quotesQueryId: 'tss_match_phrase_query',
        multiQuoteQueryId: 'multi_quote_single_token_query',
        enableCb: 'false',        // Disable Crunchbase results
        enableNavLinks: 'false',  // Disable navigation links
        enableEnhancedTrivialQuery: 'false'
    });

    return () => fetch(`/api/search/${symbol}?${params.toString()}`, header).then(resp => resp.json())
}


export interface ISearchResult {
    explains: any[];
    count: number;
    quotes: ISearchQuote[];
    news: INewsItem[];
    nav: any[];
    lists: any[];
    researchReports: any[];
    screenerFieldResults: any[];
    totalTime: number;
    timeTakenForQuotes: number;
    timeTakenForNews: number;
    timeTakenForAlgowatchlist: number;
    timeTakenForPredefinedScreener: number;
    timeTakenForCrunchbase: number;
    timeTakenForNav: number;
    timeTakenForResearchReports: number;
    timeTakenForScreenerField: number;
    timeTakenForCulturalAssets: number;
    timeTakenForSearchLists: number;
}

export interface ISearchQuote {
    exchange: string;
    shortname: string;
    quoteType: string;
    symbol: string;
    index: string;
    score: number;
    typeDisp: string;
    longname: string;
    exchDisp: string;
    sector?: string;
    sectorDisp?: string;
    industry?: string;
    industryDisp?: string;
    dispSecIndFlag?: boolean;
    isYahooFinance: boolean;
    name?: string;
    permalink?: string;
}

export interface INewsItem {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: string;
    type: string;
    thumbnail: IThumbnail;
    relatedTickers: string[];
}

export interface IThumbnail {
    resolutions: IResolution[];
}

export interface IResolution {
    url: string;
    width: number;
    height: number;
    tag: string;
} 