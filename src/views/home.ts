import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"
import Markdown from "../components/markdown"
import * as ideas from "../api/ideas"
import * as template from "text!./home.html"

@Component({
    template,
    components: {
        markdown: Markdown
    }
})
export default class HomeView extends Vue {
    markdown: string = "## Hi there Rexy\n What do you wanna **do** .."

    idea: ideas.IdeaV2 = null

    mounted() {
        ideas.getRandomIdeaV2().then(idea => {
            this.idea = idea
        })

    }

    navigate(name: string, opts?: RawLocation) {
        if (~name.indexOf("://")) return window.open(name, "_blank")
        router.push(Object.assign({
            name
        }, opts))
    }
}