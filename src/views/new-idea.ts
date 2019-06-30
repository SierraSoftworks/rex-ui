import Vue from "vue"
import Component from "vue-class-component"
import Markdown from "../components/markdown"
import { RawLocation } from "vue-router"

import { router } from "../router"

import * as template from "text!./new-idea.html"
import {
    IdeaV2, getRandomIdeaV2, postIdeaV2
} from "../api/ideas";
import { formatTime } from "../filters";

@Component({
    template,
    components: {
        markdown: Markdown
    }
})
export default class NewIdeaView extends Vue {
    idea: IdeaV2 = {
        name: "",
        description: "",
        tags: [],
        completed: false
    };

    inputVisible = false
    inputValue = ''

    postIdea(idea: IdeaV2) {
        postIdeaV2(idea).then(i => {
            this.resetform();
        }).catch(err => console.error(err));
    }
    navigate(name: string, opts?: RawLocation) {
        if (~name.indexOf("://")) return window.open(name, "_blank")
        router.push(Object.assign({
            name
        }, opts))
    }

    handleClose(tag) {
        this.idea.tags.splice(this.idea.tags.indexOf(tag), 1);
    }

    showInput() {
        this.inputVisible = true;
        this.$nextTick(<any>(_ => {
            (<any>this.$refs.saveTagInput).$refs.input.focus();
        }));
    }

    handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
            this.idea.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
    }

    resetform() {
        console.log("resetting form")
        this.idea.name = ""
        this.idea.description = ""
        this.idea.tags = []
        this.idea.completed = false
    }
}