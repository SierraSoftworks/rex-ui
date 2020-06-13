import Vue from "vue";

import "./components/index";
import "./filters/index";
import "./views/index";

import { store, ACT_REFRESH } from "./store";
import { router } from "./router";
import SparkMD5 = require("spark-md5");
import { Account } from "msal";

export const app = new Vue({
    el: "#app",
    data: {

    },
    store,
    router,
    computed: {
        loading() {
            return this.$store.state.loading
        },
        api() {
            return this.$store.state.api
        },
        error() {
            return this.$store.state.requestError
        },

        user(): Account {
            return store.state.user
        },

        collection() {
            return store.getters.collection
        },

        firstName() {
            if (!this.user) return "Nobody"

            return this.user.name.split(' ')[0] || this.user.name
        },

        avatarUrl() {
            if (this.user) {
                const emailHash = SparkMD5.hash(this.user.userName.toLowerCase().trim())

                return `https://www.gravatar.com/avatar/${emailHash}?s=50`
            }

            return "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        }
    },
    mounted() {
        store.dispatch(ACT_REFRESH).catch(err => {
            // Ignore any errors in refreshing initially (we might not be signed in)
        })
    },
    watch: {
        error(err) {
            if (!err) return
            this.$notify.error({
                title: `${err.code || 500} ${err.name || 'Server Error'}`,
                message: err.message || err,
                duration: 0
            })
        }
    },
    methods: {

    }
})
