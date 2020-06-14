import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"
import * as template from "text!./new-collection.html"
import TagEditor from "../components/tag-editor"
import { store, MUT_SET_COLLECTIONS } from "../store"
import { Collection, newCollection } from "../api/collections"

@Component({
    template,
    components: {
        "tag-editor": TagEditor
    }
})
export default class NewCollectionView extends Vue {
    newCollection: Collection = {
        name: ""
    }

    async create() {
        const collection = await newCollection(this.newCollection)
        store.commit(MUT_SET_COLLECTIONS, [...store.state.collections, collection]);
        this.navigate("manageCollection", { params: { collectionId: collection.id } })
    }

    navigate(name: string, opts?: RawLocation) {
        if (~name.indexOf("://")) return window.open(name, "_blank")
        router.push(Object.assign({
            name
        }, opts))
    }
}