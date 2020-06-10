import Vue from "vue"
import Component from "vue-class-component"
import * as template from "text!./idea-controls.html"
import { Idea } from "../api/ideas"

@Component({
    template,
    props: {
        idea: Object,
        allowComplete: {
            type: Boolean,
            default: false
        },
        allowIncomplete: {
            type: Boolean,
            default: false
        },
        allowNext: {
            type: Boolean,
            default: false
        },
        allowDelete: {
            type: Boolean,
            default: false
        }
    }
})
export default class IdeaControlsView extends Vue {
    idea!: Idea
    allowNext!: boolean

    markComplete() {
        this.$emit("complete")
    }

    markIncomplete() {
        this.$emit("incomplete")
    }

    next() {
        this.$emit("next")
    }

    remove() {
        this.$emit("delete")
    }
}