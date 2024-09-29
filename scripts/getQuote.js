import {$html, settings} from './common.js';


/**
 * returns true if quote is older than 24 hours
 * @param {quote} quote: the quote object
 */
function getQuoteIsOld(quote) {

    if(!quote) return true;
    if(Object.keys(quote).length==0) return true;
    if(!quote.quoteDate) return true;

    const quoteDate = quote.quoteDate;
    const dt = new Date().getTime();
    return dt - quoteDate > (24*60*60);
}

function setQuoteFromService() {

    chrome.runtime.sendMessage({action: "fetchQuote"}, response => {
        if (response.success) {
            const quote = { "quoteDate": new Date().getTime(), ...response.data.data };
            window.localStorage.setItem("quote", JSON.stringify(quote));
            setQuoteUI(quote);

        } else {
            console.error('Error:', response.error);
        }
    });

}

export function setQuote() {
    const quote = JSON.parse(window.localStorage.getItem("quote")) || {};
    const oldq = getQuoteIsOld(quote);

    if (!quote || Object.keys(quote).length === 0 || quote.quote === "" || oldq) {
        setQuoteFromService();
    } else {
        setQuoteUI(quote);
    }

}
function setQuoteUI(value) {
    $html("quote",  value.quote);
    $html("quoteBy", value.author);
}
