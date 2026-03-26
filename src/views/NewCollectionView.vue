<template>
    <div class="fill">
        <div class="center">
            <el-form style="min-width: 480px;">
                <el-form-item label="Name">
                    <el-input v-model="newCollection.name" placeholder="Give your collection a name"></el-input>
                </el-form-item>

                <el-button type="primary" :icon="Plus" @click="create()">Save</el-button>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import { useRouter } from "vue-router"
import { Plus } from "@element-plus/icons-vue"
import { store, MUT_SET_COLLECTIONS } from "../store"
import { Collection, newCollection as createCollection } from "../api/collections"

export default defineComponent({
    name: "NewCollectionView",
    components: {
        Plus
    },
    setup() {
        const router = useRouter()

        const newCollection = reactive<Collection>({
            name: ""
        })

        function navigate(name: string, opts?: any) {
            if (~name.indexOf("://")) return window.open(name, "_blank")
            router.push(Object.assign({ name }, opts))
        }

        async function create() {
            const collection = await createCollection(newCollection)
            store.commit(MUT_SET_COLLECTIONS, [...store.state.collections, collection])
            navigate("manageCollection", { params: { collectionId: collection.id } })
        }

        return {
            newCollection,
            create,
            Plus
        }
    }
})
</script>
