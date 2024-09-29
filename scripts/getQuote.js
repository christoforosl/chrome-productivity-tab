import { $html } from "./common.js";


/**
 * returns true if quote is older than 24 hours
 * @param {quote} quote: the quote object
 */
function getQuoteIsOld(quote) {
    if(!quote) return true;
    if(Object.keys(quote).length==0) return true;
    if(!quote.quoteDate) return true;

    const quoteDate = quote.quoteDate;
    const dt = new Date().toDateString();
    return dt !== quoteDate;
}

function setQuoteFromService() {

    chrome.runtime.sendMessage({action: "fetchQuote"}, response => {
        if (response.success) {
            const quote = { "quoteDate": new Date().getTime(), ...response.data.data };
            chrome.storage.local.set({ "quote":quote }, function() {
                setQuoteUI(quote);
            });

        } else {
            console.error('Error:', response.error);
        }
    });

}

export function setQuote() {
    chrome.storage.local.get("quote", function (quote) {
        const oldq = getQuoteIsOld(quote ? quote.quoteDate : null);

        if (!quote || Object.keys(quote).length === 0 || quote.quote === "" || oldq) {
            setQuoteFromService();
        } else {
            setQuoteUI(quote);
        }
    });
}
function setQuoteUI(value) {
    $html("quote",  value.quote);
    $html("quoteBy", value.author);
}
