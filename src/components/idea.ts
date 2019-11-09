import Vue from "vue"
import Component from "vue-class-component"
import * as template from "text!./idea.html"
import { Idea } from "../api/ideas"
import Markdown from "./markdown"

@Component({
    template,
    props: {
        idea: Object
    },
    components: {
        markdown: Markdown
    }
})
export default class IdeaView extends Vue {
    idea!: Idea
}