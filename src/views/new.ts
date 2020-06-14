import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"
import * as template from "text!./new.html"
import { Idea, newIdea } from "../api/ideas"
import TagEditor from "../components/tag-editor"
import { store, MUT_SET_COLLECTION } from "../store"

@Component({
    template,
    props: {
        collectionId: {
            type: String,
            required: true
        }
    },
    components: {
        "tag-editor": TagEditor
    }
})
export default class NewIdeaView extends Vue {
    collectionId!: string;
    newIdea: Idea = {
        name: "",
        collection: store.state.selectedCollectionId,
        description: "",
        tags: []
    }

    get collection() {
        return store.getters.collection
    }

    async mounted() {
        this.collectionId && this.setCollection(this.collectionId)
    }

    async setCollection(id: string) {
        store.commit(MUT_SET_COLLECTION, id)
    }

    async create() {
        const idea = await newIdea(this.newIdea)
        this.navigate("idea", { params: { collectionId: idea.collection, ideaId: idea.id } })
    }

    navigate(name: string, opts?: RawLocation) {
        if (~name.indexOf("://")) return window.open(name, "_blank")
        router.push(Object.assign({
            name
        }, opts))
    }
}