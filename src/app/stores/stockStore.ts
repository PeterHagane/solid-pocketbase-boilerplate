import { createSignal } from "solid-js"
import { IQuote } from "../components/stocks/stockView"

const STORAGE_KEY = "stockStore_quotes"

// Initialize store with data from localStorage if available
const getInitialStore = (): IQuote[] => {
    if (typeof window !== "undefined") {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored ? JSON.parse(stored) : []
        } catch (error) {
            console.warn("Failed to load stocks from localStorage:", error)
            return []
        }
    }
    return []
}

const persistStockStore = ()=>{
    try {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stockStore()))
        }
    } catch (error) {
        console.warn("Failed to persist stocks to localStorage:", error)
    }
}

const [stockStore, setStockStore] = createSignal<IQuote[]>(getInitialStore())

export const useStockStore =()=> {   
    const addQuote = (quote: IQuote) => {
        if(stockStore().find(q => q.symbol === quote.symbol)) {
            setStockStore(prev => prev.map(q => q.symbol === quote.symbol ? quote : q))
        } else {
            setStockStore(prev => [...prev, quote])
        }
        persistStockStore()
    }
    
    const removeQuote = (symbol: string) => {
        setStockStore(prev => prev.filter(quote => quote.symbol !== symbol))
        persistStockStore()
    }

    const deleteQuotes = () => {
        setStockStore([])
        localStorage.removeItem(STORAGE_KEY)
        persistStockStore()
    }

    return {
        persistStockStore,
        addQuote,
        removeQuote,
        deleteQuotes,
        stockStore
    }
}





// Create everything inside a singleton root for proper reactivity
// export const useStockStore = () => createSingletonRoot(() => {
//     // Create a query client for programmatic queries
//     const queryClient = new QueryClient()
    
//     const [stockStore, setStockStore] = createStore<IQuote[]>(getInitialStore())

//     // Auto-persist to localStorage whenever store changes
//     createEffect(() => {
//         try {
//             if (typeof window !== "undefined") {
//                 localStorage.setItem(STORAGE_KEY, JSON.stringify(stockStore))
//             }
//         } catch (error) {
//             console.warn("Failed to persist stocks to localStorage:", error)
//         }
//     })

//     // Function to fetch and add a quote to the store using TanStack Query
//     const addQuoteBySymbol = async (symbol: string): Promise<IQuote | null> => {
//         try {
//             const quote: IQuote = await queryClient.fetchQuery({
//                 queryKey: ['quote', symbol],
//                 queryFn: fetchQuote(symbol),
//                 staleTime: 1000 * 60 * 5, // 5 minutes
//                 gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
//             })
            
//             // Check if quote already exists in store (by symbol)
//             const existingIndex = stockStore.findIndex(q => q.symbol === quote.symbol)
            
//             if (existingIndex >= 0) {
//                 // Update existing quote
//                 setStockStore(existingIndex, quote)
//             } else {
//                 // Add new quote
//                 setStockStore(stockStore.length, quote)
//             }
            
//             return quote
//         } catch (error) {
//             console.error('Failed to fetch quote for symbol:', symbol, error)
//             return null
//         }
//     }

//     // Function to remove a quote from the store
//     const removeQuoteBySymbol = (symbol: string): boolean => {
//         const index = stockStore.findIndex(q => q.symbol === symbol)
//         if (index >= 0) {
//             setStockStore(prev => prev.filter((_, i) => i !== index))
//             return true
//         }
//         return false
//     }

//     // Hook version for use in components (uses the app's query client)
//     const useAddQuoteToStore = () => {
//         const queryClient = useQueryClient()
        
//         return async (symbol: string): Promise<IQuote | null> => {
//             try {
//                 const quote: IQuote = await queryClient.fetchQuery({
//                     queryKey: ['quote', symbol],
//                     queryFn: fetchQuote(symbol),
//                     staleTime: 1000 * 60 * 5, // 5 minutes
//                     gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
//                 })
                
//                 // Check if quote already exists in store (by symbol)
//                 const existingIndex = stockStore.findIndex(q => q.symbol === quote.symbol)
                
//                 if (existingIndex >= 0) {
//                     // Update existing quote
//                     setStockStore(existingIndex, quote)
//                 } else {
//                     // Add new quote
//                     setStockStore(stockStore.length, quote)
//                 }
                
//                 return quote
//             } catch (error) {
//                 console.error('Failed to fetch quote for symbol:', symbol, error)
//                 return null
//             }
//         }
//     }

//     // Return all the store functions and state
//     return {
//         stockStore,
//         setStockStore,
//         addQuoteBySymbol,
//         removeQuoteBySymbol,
//         useAddQuoteToStore
//     }
// })

// Initialize the store
// export const {
//     stockStore,
//     setStockStore,
//     addQuoteBySymbol,
//     removeQuoteBySymbol,
//     useAddQuoteToStore
// } = createStockStore()()


// Example usage
// import { addQuoteBySymbol, removeQuoteBySymbol, stockStore } from './stores/stockStore'

// // Add a stock quote
// const quote = await addQuoteBySymbol('AAPL')

// // Remove a stock quote  
// removeQuoteBySymbol('AAPL')

// // Access the store (reactive)
// console.log(stockStore) // Array of IQuote objects