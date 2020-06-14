import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"

import * as template from "text!./idea.html"
import { store, MUT_SET_COLLECTION } from "../store"
import { getIdea, Idea, storeIdea, removeIdea } from "../api/ideas"
import IdeaComponent from "../components/idea"
import IdeaControlsComponent from "../components/idea-controls"

@Component({
    template,
    components: {
        idea: IdeaComponent,
        "idea-controls": IdeaControlsComponent
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

    get user() {
        return store.state.user
    }

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

    async markCompleted(complete: boolean) {
        if (!this.idea) return;

        this.idea = await storeIdea({
            ...this.idea,
            completed: complete
        })
    }

    async remove() {
        await removeIdea(this.idea.id, this.idea.collection);

        this.navigate("home", { params: { collectionId: this.idea.collection } })
    }
}