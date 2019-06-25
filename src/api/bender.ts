import { store } from "../store";
import * as helpers from "./helpers";

export interface Quote {
    who: string;
    quote: string;
}

/**
 * Queries the API server for its current health status
 */
export function getQuote() {
    return fetch(helpers.buildUrl("https://bender.sierrasoftworks.com/api/v1/quote"))
        .then(res => helpers.apiHandleResponse<Quote>(res, true))
}