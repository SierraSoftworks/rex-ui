<template>
    <el-container class="app">
        <el-header class="header" height="65px">
            <h2>
                <router-link :to="{ name: 'home' }" class="header__name">REX</router-link>

                <span v-if="collection">
                    <span class="header__separator">/</span>
                    <span class="header__collection">{{ collection.name }}</span>
                </span>
            </h2>

            <div class="header-menu">
                <router-link :to="{ name: 'new', params: { collectionId: collection.id } }" v-if="collection">
                    <el-icon><Plus /></el-icon>
                </router-link>

                <router-link :to="{ name: 'newCollection' }" v-if="user">
                    <el-icon><DocumentAdd /></el-icon>
                </router-link>
                <router-link :to="{ name: 'collections' }" v-if="user">
                    <el-icon><DocumentCopy /></el-icon>
                </router-link>

                <div v-if="user">
                    <el-avatar :size="16" :src="avatarUrl"></el-avatar>
                    {{ firstName }}
                </div>
            </div>
        </el-header>
        <el-main class="content" v-loading="loading">
            <router-view :key="$route.fullPath"></router-view>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from "vue"
import { useStore } from "vuex"
import { Plus, DocumentAdd, DocumentCopy } from "@element-plus/icons-vue"
import { ElNotification } from "element-plus"
import SparkMD5 from "spark-md5"
import { ACT_REFRESH } from "./store"

export default defineComponent({
    name: "App",
    components: {
        Plus,
        DocumentAdd,
        DocumentCopy
    },
    setup() {
        const store = useStore()

        const loading = computed(() => store.state.loading)
        const api = computed(() => store.state.api)
        const error = computed(() => store.state.requestError)
        const user = computed(() => store.state.user)
        const collection = computed(() => store.getters.collection)

        const firstName = computed(() => {
            if (!user.value) return "Nobody"
            return user.value.name.split(" ")[0] || user.value.name
        })

        const avatarUrl = computed(() => {
            if (user.value) {
                const emailHash = SparkMD5.hash(user.value.username.toLowerCase().trim())
                return `https://www.gravatar.com/avatar/${emailHash}?s=50`
            }
            return "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        })

        watch(error, (err) => {
            if (!err) return
            ElNotification.error({
                title: `${err.code || 500} ${err.name || "Server Error"}`,
                message: err.message || err,
                duration: 0
            })
        })

        store.dispatch(ACT_REFRESH).catch(() => {
            // Ignore any errors in refreshing initially (we might not be signed in)
        })

        return {
            loading,
            api,
            error,
            user,
            collection,
            firstName,
            avatarUrl
        }
    }
})
</script>

<style>
.app {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.app > * {
    margin: 0;
    padding: 0;
}

.header {
    font-family: 'Montserrat';
    padding: 0 20px;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.header-menu {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: flex-end;
}

.header-menu a {
    text-decoration: none;
    color: #444;
    background: #fff;
    line-height: var(--header-height);
    padding: 0 20px;
    vertical-align: middle;
    transition: 0.25s ease background;
}

.header-menu a:hover {
    background: #eee;
}

.header-menu div {
    text-decoration: none;
    color: #444;
    background: #fff;
    line-height: var(--header-height);
    padding: 0 20px;
    vertical-align: middle;
}

.header__name {
    font-weight: 100;
    text-decoration: none;
    color: #000;
}

.header__separator {
    opacity: 0.3;
}

.header__collection {
    font-weight: 300;
    text-transform: lowercase;
}

.content {
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
}
</style>
