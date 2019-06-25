import Vue from "vue"
import Component from "vue-class-component"
import Markdown from "../components/markdown"

import * as template from "text!./quotes.html"
import { Quote, getQuote } from "../api/bender";
@Component({
    template,
    components: {
        markdown: Markdown
    }
})
export default class QuoteView extends Vue {
    quote: Quote = null;

    mounted() {
        getQuote().then(q => this.quote = q).catch(err => console.error(err));
    }
}