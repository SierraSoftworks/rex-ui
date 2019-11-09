import Vue from "vue";

import "./components/index";
import "./filters/index";
import "./views/index";

import { store, ACT_REFRESH } from "./store";
import { router } from "./router";

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

        username() {
            return this.$store.state.username
        },
        error() {
            return this.$store.state.requestError
        },

        user() {
            return store.state.user
        },

        collection() {
            return store.getters.collection
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
