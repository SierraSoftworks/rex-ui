import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"

import * as template from "text!./invite.html"
import { store, MUT_SET_COLLECTION } from "../store"
import { User, getUser } from "../api/users"
import { setRoleAssignment, Role } from "../api/role-assignments"

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
        },
        emailAddress(address) {
            this.noSuchUser = false
            this.user = null
            if (this._debounceHandle) clearTimeout(this._debounceHandle)

            this._debounceHandle = setTimeout(() => {
                this._debounceHandle = null
                getUser(address).then(user => this.user = user).catch(err => {
                    this.user = null
                    this.noSuchUser = true
                })
            }, 1000)
        }
    }
})
export default class InviteView extends Vue {
    collectionId!: string

    user: User = null

    emailAddress: string = ""
    noSuchUser: boolean = false

    role: Role = "Viewer"

    roles: Role[] = [
        "Owner",
        "Contributor",
        "Viewer"
    ]

    private _debounceHandle = null

    async mounted() {
        this.collectionId && this.setCollection(this.collectionId)
    }

    async setCollection(id: string) {
        store.commit(MUT_SET_COLLECTION, id)
    }

    navigate(name: string, opts?: RawLocation) {
        if (~name.indexOf("://")) return window.open(name, "_blank")
        router.push(Object.assign({
            name
        }, opts))
    }

    get avatarUrl() {
        if (!this.user) return "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"

        return `https://www.gravatar.com/avatar/${this.user.emailHash}?s=50`
    }

    avatarErrorHandler() {
        return true
    }

    async inviteUser() {
        await setRoleAssignment({
            collectionId: this.collectionId,
            userId: this.user.id,
            role: this.role
        })

        this.navigate("manageCollection", { params: { collectionId: this.collectionId }})
    }
}