import cx from "classnames"
import css from "./stockViewCard.module.scss"
import { Component, JSX } from "solid-js"
import { IQuote } from "./stockView"

interface IStockViewCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
    quote: IQuote;
}

const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

const formatPercent = (percent: number) => {
    const formatted = (percent * 100).toFixed(2);
    return `${percent >= 0 ? '+' : ''}${formatted}%`;
};

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
};

const getChangeColor = (change: number) => {
    if (change > 0) return css.positive;
    if (change < 0) return css.negative;
    return css.neutral;
};

export const StockViewCard: Component<IStockViewCardProps> = (props) => {
    const { quote, ...divProps } = props;

    const marketData = [
        ['Open', formatPrice(quote.regularMarketOpen, quote.currency)],
        ['High', formatPrice(quote.regularMarketDayHigh, quote.currency)],
        ['Low', formatPrice(quote.regularMarketDayLow, quote.currency)],
        ['Previous Close', formatPrice(quote.regularMarketPreviousClose, quote.currency)],
        ['Volume', formatNumber(quote.regularMarketVolume)],
        ['Market Cap', quote.marketCap ? formatPrice(quote.marketCap, quote.currency) : 'N/A']
    ];

    const rangeData = [
        ['52W Low', formatPrice(quote.fiftyTwoWeekLow, quote.currency)],
        ['52W High', formatPrice(quote.fiftyTwoWeekHigh, quote.currency)],
        ['52W Change', formatPercent(quote.fiftyTwoWeekChangePercent), getChangeColor(quote.fiftyTwoWeekChangePercent)]
    ];

    const financialData = [
        quote.trailingPE ? ['P/E Ratio', quote.trailingPE.toFixed(2)] : null,
        quote.forwardPE ? ['Forward P/E', quote.forwardPE.toFixed(2)] : null,
        quote.priceToBook ? ['P/B Ratio', quote.priceToBook.toFixed(2)] : null,
        quote.dividendYield ? ['Dividend Yield', formatPercent(quote.dividendYield)] : null
    ].filter((item): item is [string, string] => item !== null);

    const additionalData = [
        ['Quote Type', quote.typeDisp || quote.quoteType],
        ['Currency', quote.currency],
        ['Region', quote.region],
        quote.averageAnalystRating ? ['Analyst Rating', quote.averageAnalystRating] : null
    ].filter((item): item is [string, string] => item !== null);

    return (
        <div {...divProps} class={cx(css.card, props.class)}>
            {/* Header */}
            <div class={css.header}>
                <div class={css.top}>
                    <div>
                        <div class={css.symbol}>{quote.symbol}</div>
                        <div class={css.name}>{quote.longName || quote.shortName}</div>
                    </div>
                    <div class={css.badge}>{quote.fullExchangeName || quote.exchange}</div>
                </div>
                <div class={css.price}>
                    <div class={css.current}>{formatPrice(quote.regularMarketPrice, quote.currency)}</div>
                    <div class={cx(css.change, getChangeColor(quote.regularMarketChange))}>
                        {formatPrice(quote.regularMarketChange, quote.currency)} ({formatPercent(quote.regularMarketChangePercent)})
                    </div>
                    <div class={css.badge}>{quote.marketState}</div>
                </div>
            </div>

            {/* Data Sections */}
            <div class={css.section}>
                <div class={css.title}>Market Data</div>
                <div class={css.grid}>
                    {marketData.map(([label, value]) => (
                        <div class={css.row}>
                            <span>{label}:</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div class={css.section}>
                <div class={css.title}>52 Week Range</div>
                <div class={css.grid}>
                    {rangeData.map(([label, value, colorClass]) => (
                        <div class={css.row}>
                            <span>{label}:</span>
                            <span class={colorClass}>{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {financialData.length > 0 && (
                <div class={css.section}>
                    <div class={css.title}>Financial Metrics</div>
                    <div class={css.grid}>
                        {financialData.map(([label, value]) => (
                            <div class={css.row}>
                                <span>{label}:</span>
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div class={css.section}>
                <div class={css.title}>Additional Information</div>
                <div class={css.grid}>
                    {additionalData.map(([label, value]) => (
                        <div class={css.row}>
                            <span>{label}:</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StockViewCard;
