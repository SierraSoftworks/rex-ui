import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"

import * as template from "text!./home.html"
import { store, ACT_LOGIN, MUT_SET_COLLECTION } from "../store"
import { getIdea, Idea, storeIdea, removeIdea } from "../api/ideas"
import IdeaView from "../components/idea"
import TagEditor from "../components/tag-editor"
import { Collection } from "../api/collections"
import IdeaControlsComponent from "../components/idea-controls"

@Component({
    template,
    components: {
        idea: IdeaView,
        "idea-controls": IdeaControlsComponent,
        "tag-editor": TagEditor
    },
    props: {
        collectionId: {
            type: String,
            required: false,
            default: null
        }
    },
    watch: {
        collectionId(id) {
            this.setCollection(id)
        }
    }
})
export default class HomeView extends Vue {
    collectionId!: string

    idea: Idea = null

    get user() {
        return store.state.user
    }

    get collection(): Collection {
        return store.getters.collection
    }

    login() {
        return store.dispatch(ACT_LOGIN)
    }

    async mounted() {
        this.collectionId && this.setCollection(this.collectionId)
        this.idea = await getIdea("random", this.collection && this.collection.id)
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

    async markCompleted(completed: boolean) {
        if (!this.idea) return;

        this.idea = await storeIdea({
            ...this.idea,
            completed: completed
        })
    }

    async next() {
        this.idea = await getIdea("random", this.collection && this.collection.id)
    }

    async remove() {
        await removeIdea(this.idea.id, this.idea.collection);

        await this.next()
    }
}