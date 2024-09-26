import { $html, options } from "./common.js";

const CALL_QUOTE_HEADERS = new Headers({
    accept: "application/json",
    useQueryString: true,
});

/**
 * returns true if quote is older than 24 hours
 * @param {long} quoteDate: the quote's set time, in epoch seconds
 */
function getQuoteIsOld(quoteDate) {
    if (!quoteDate) return true;
    const dt = new Date().toDateString();
    return dt !== quoteDate;
}

function setQuoteFromService() {
    fetch("https://stoic.tekloon.net/stoic-quote",{mode: 'no-cors'})
        .then((response) => {
           return response.text();
        })
        .then((contents) => {
            if (contents) {
                const quote = contents.data.quote;
                const author = contents.data.author;

                $html("quote", `"${quote}"`);
                $html("quoteBy", author);
                const dt = new Date().toDateString();
                const quoteObj = {
                    quote: quote,
                    quoteBy: author,
                    quoteDate: dt,
                };
                chrome.storage.local.set(quoteObj, function () {
                    console.log("set quote in storage" + JSON.stringify(quoteObj));
                });
            }
        })
        .catch((error) => {
            console.warn("Fetch error:", error);
            $html("quote", "Failed to fetch quote.");
            $html("quoteBy", "");
        });
}

export function setQuote() {
    chrome.storage.local.get(["quote", "quoteDate", "quoteBy"], function (value) {
        const oldq = getQuoteIsOld(value ? value.quoteDate : null);

        if (!value || value.length === 0 || value.quote === "" || oldq) {
            setQuoteFromService();
        } else {
            console.log("Set quote from storage :-)");
            $html("quote", '"' + value.quote + '"');
            $html("quoteBy", value.quoteBy);
        }
    });
}
