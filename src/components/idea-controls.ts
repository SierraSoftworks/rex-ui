import Vue from "vue"
import Component from "vue-class-component"
import * as template from "text!./idea-controls.html"
import { Idea } from "../api/ideas"

@Component({
    template,
    props: {
        idea: Object,
        allowNext: {
            type: Boolean,
            default: false
        }
    }
})
export default class IdeaControlsView extends Vue {
    idea!: Idea
    allowNext!: boolean

    markComplete() {
        this.$emit("completed")
    }

    next() {
        this.$emit("next")
    }
}