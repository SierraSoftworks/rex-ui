import Vue from "vue"
import Component from "vue-class-component"
import Markdown from "../components/markdown"

import * as template from "text!./ideas.html"
import {
    IdeaV2, getRandomIdeaV2
} from "../api/ideas";
@Component({
    template,
    components: {
        markdown: Markdown
    }
})
export default class IdeaView extends Vue {
    idea: IdeaV2 = null;

    mounted() {
        getRandomIdeaV2().then(i => this.idea = i).catch(err => console.error(err));
    }

}