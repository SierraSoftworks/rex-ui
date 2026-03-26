<template>
    <el-container>
        <el-header>
            <h1>Collections</h1>
        </el-header>
        <el-main>
            <p>
                Collections allow you to organize and share your ideas with others.
            </p>

            <div v-for="collection in collections" :key="collection.id">
                <h4>{{ collection.name }}</h4>
                <el-button-group>
                    <el-button type="primary" :icon="Document"
                        @click="navigate('collection', { params: { collectionId: collection.id } })">Open</el-button>
                    <el-button :icon="DocumentAdd"
                        @click="navigate('new', { params: { collectionId: collection.id } })">New
                        Idea</el-button>
                    <el-button :icon="DocumentChecked"
                        @click="navigate('manageCollection', { params: { collectionId: collection.id } })">Manage</el-button>
                </el-button-group>
            </div>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useRouter } from "vue-router"
import { Document, DocumentAdd, DocumentChecked } from "@element-plus/icons-vue"
import { store } from "../store"

export default defineComponent({
    name: "CollectionsView",
    components: {
        Document,
        DocumentAdd,
        DocumentChecked
    },
    setup() {
        const router = useRouter()

        const collections = computed(() => store.state.collections)

        function navigate(name: string, opts?: any) {
            if (~name.indexOf("://")) return window.open(name, "_blank")
            router.push(Object.assign({ name }, opts))
        }

        return {
            collections,
            navigate,
            Document,
            DocumentAdd,
            DocumentChecked
        }
    }
})
</script>
