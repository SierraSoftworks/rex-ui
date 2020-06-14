import Vue from "vue";
import * as Vuex from "vuex";
import { login, Scope, logout, getAccessToken, getAccount } from "./api/auth";
import { Account } from "msal";
import { Collection, getCollections } from "./api/collections";

Vue.use(Vuex);

export const MUT_CONNECTED = "connected"
export const MUT_DISCONNECTED = "disconnected"
export const MUT_SET_API = "set-api"
export const MUT_REQUEST_ERROR = "set-request-error"
export const MUT_LOADING = "set-loading"

export const MUT_SET_USER = "set-user"
export const MUT_SET_COLLECTIONS = "set-collections"
export const MUT_SET_COLLECTION = "set-collection"

export const ACT_LOGIN = "login"
export const ACT_LOGOUT = "logout"
export const ACT_REFRESH = "refresh"

interface StoreData {
    api: string;

    connected: boolean;
    loading: boolean;
    requestError: Error;

    user: Account
    collections: Collection[]
    selectedCollectionId: string
}

export const store = new Vuex.Store<StoreData>({
    state: {
        api: localStorage.getItem("api:url") || window.location.origin,
        connected: false,
        requestError: null,
        loading: false,

        user: getAccount(),
        collections: [],
        selectedCollectionId: null
    },
    mutations: {
        [MUT_SET_API](state, url: string) {
            state.api = url
            localStorage.setItem("api:url", url)
        },
        [MUT_REQUEST_ERROR](state, error: Error) {
            state.requestError = error
        },
        [MUT_LOADING](state, loading: boolean) {
            state.loading = loading
        },

        [MUT_SET_USER](state, user: Account) {
            state.user = user
        },
        [MUT_SET_COLLECTIONS](state, collections: Collection[]) {
            state.collections = collections
        },
        [MUT_SET_COLLECTION](state, collectionId: string) {
            state.selectedCollectionId = collectionId
        }
    },
    actions: {
        async [ACT_LOGIN](context) {
            const account = await login(Scope["Ideas.Read"], Scope["Ideas.Write"], Scope["Collections.Read"], Scope["Collections.Write"], Scope["RoleAssignments.Write"])
            context.commit(MUT_SET_USER, account)
            context.dispatch(ACT_REFRESH)
        },
        [ACT_LOGOUT](context) {
            logout()
            context.commit(MUT_SET_USER, null)
        },
        async [ACT_REFRESH](context) {
            context.commit(MUT_LOADING, true)
            try {
                if (!context.state.user) throw new Error("You must be signed in first")
                const collections = await getCollections()
                context.commit(MUT_SET_COLLECTIONS, collections)
            } catch (err) {
                context.commit(MUT_REQUEST_ERROR, err)
            } finally {
                context.commit(MUT_LOADING, false)
            }
        }
    },
    getters: {
        collection(state) {
            if (!state.selectedCollectionId) return state.collections[0]
            return state.collections.find(c => c.id === state.selectedCollectionId)
        }
    }
})