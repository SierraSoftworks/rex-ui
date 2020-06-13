import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"

import * as template from "text!./collection.html"
import { store, MUT_SET_COLLECTION, MUT_REQUEST_ERROR } from "../store"
import { Collection, getCollection } from "../api/collections"
import { Idea, getIdeas, storeIdea, removeIdea } from "../api/ideas"
import { RoleAssignment, getRoleAssignments, removeRoleAssignment } from "../api/role-assignments"

@Component({
    template,
    components: {
    },
    props: {
        collectionId: {
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
export default class CollectionView extends Vue {
    collectionId!: string

    collection: Collection = null;
    ideas: Idea[] = [];
    users: RoleAssignment[] = [];

    async mounted() {
        this.collectionId && this.setCollection(this.collectionId)
    }

    async setCollection(id: string) {
        store.commit(MUT_SET_COLLECTION, id)

        await Promise.all([
            async () => this.collection = await getCollection(this.collectionId),
            async () => this.users = await getRoleAssignments(this.collectionId),
            async () => this.ideas = await getIdeas(this.collectionId),
        ]).catch(err => store.commit(MUT_REQUEST_ERROR, err))
    }

    navigate(name: string, opts?: RawLocation) {
        if (~name.indexOf("://")) return window.open(name, "_blank")
        router.push(Object.assign({
            name
        }, opts))
    }
    

    async markComplete(idea: Idea, complete: boolean) {
        if (!idea) return;

        const i = this.ideas.indexOf(idea);
        if (!~i) return;

        this.ideas.splice(i, 1, await storeIdea({
            ...idea,
            completed: complete
        }))
    }

    async deleteIdea(idea: Idea) {
        if (!idea) return;

        const i = this.ideas.indexOf(idea);
        if (!~i) return;
        
        await removeIdea(idea.id, idea.collection);
        this.ideas.splice(i, 1)
    }

    async deleteUser(user: RoleAssignment) {
        if (!user) return;

        const i = this.users.indexOf(user);
        if (!~i) return;
        
        await removeRoleAssignment(user.collectionId, user.userId);
        this.users.splice(i, 1)
    }

    ideaRowClassName(row: { row: Idea, rowIndex: number }) {
        if (row.row.completed) return "success-row"

        return ""
    }
}