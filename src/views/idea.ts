import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"

import * as template from "text!./home.html"
import { store, MUT_SET_COLLECTION } from "../store"
import { getIdea, Idea } from "../api/ideas"
import IdeaComponent from "../components/idea"

@Component({
    template,
    components: {
        idea: IdeaComponent
    },
    props: {
        collectionId: {
            type: String,
            required: true
        },
        ideaId: {
            type: String,
            required: true
        }
    },
    watch: {
        collectionId(id) {
            this.setCollection(id)
        }
    }
})
export default class IdeaView extends Vue {
    collectionId!: string
    ideaId!: string

    idea: Idea = null

    async mounted() {
        this.collectionId && this.setCollection(this.collectionId)
        this.idea = await getIdea(this.ideaId, this.collectionId)
    }

    setCollection(id: string) {
        store.commit(MUT_SET_COLLECTION, id)
    }

    navigate(name: string, opts?: RawLocation) {
        if (~name.indexOf("://")) return window.open(name, "_blank")
        router.push(Object.assign({
            name
        }, opts))
    }
}