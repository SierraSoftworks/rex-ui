<template>
    <div class="fill">
        <div class="center">
            <h2>Add a new idea to {{ collection && collection.name }}</h2>

            <el-form style="min-width: 480px;">
                <el-form-item label="Name">
                    <el-input v-model="newIdea.name" placeholder="Give your idea a name"></el-input>
                </el-form-item>

                <el-form-item label="Description">
                    <el-input type="textarea" v-model="newIdea.description" placeholder="Describe the idea"></el-input>
                </el-form-item>

                <el-form-item label="Tags">
                    <TagEditor v-model="newIdea.tags"></TagEditor>
                </el-form-item>

                <el-button type="primary" :icon="Plus" @click="create()">Save</el-button>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { Plus } from "@element-plus/icons-vue"
import { Idea, newIdea as createIdea } from "../api/ideas"
import { store, MUT_SET_COLLECTION } from "../store"
import TagEditor from "../components/TagEditor.vue"

export default defineComponent({
    name: "NewView",
    components: {
        TagEditor,
        Plus
    },
    props: {
        collectionId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const router = useRouter()

        const newIdea = reactive<Idea>({
            name: "",
            collection: store.state.selectedCollectionId,
            description: "",
            tags: []
        })

        const collection = computed(() => store.getters.collection)

        function setCollection(id: string) {
            store.commit(MUT_SET_COLLECTION, id)
        }

        function navigate(name: string, opts?: any) {
            if (~name.indexOf("://")) return window.open(name, "_blank")
            router.push(Object.assign({ name }, opts))
        }

        async function create() {
            const idea = await createIdea(newIdea)
            navigate("idea", { params: { collectionId: idea.collection, ideaId: idea.id } })
        }

        onMounted(() => {
            if (props.collectionId) setCollection(props.collectionId)
        })

        return {
            newIdea,
            collection,
            create,
            Plus
        }
    }
})
</script>
