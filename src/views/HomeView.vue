<template>
    <div class="fill">
        <div class="center">
            <p v-if="!user">
                We notice you're not yet authenticated. You'll need to
                <el-button type="primary" @click="login()">Login</el-button>
                before you can continue.
            </p>

            <IdeaDisplay v-if="user && idea" :idea="idea"></IdeaDisplay>
        </div>

        <div class="bottom">
            <IdeaControls v-if="user" :idea="idea"
                :allow-complete="true" @complete="markCompleted(true)"
                :allow-incomplete="true" @incomplete="markCompleted(false)"
                :allow-next="true" @next="next()"
                :allow-delete="true" @delete="remove()"></IdeaControls>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import { store, ACT_LOGIN, MUT_SET_COLLECTION } from "../store"
import { getIdea, Idea, storeIdea, removeIdea } from "../api/ideas"
import IdeaDisplay from "../components/IdeaDisplay.vue"
import IdeaControls from "../components/IdeaControls.vue"

export default defineComponent({
    name: "HomeView",
    components: {
        IdeaDisplay,
        IdeaControls
    },
    props: {
        collectionId: {
            type: String,
            required: false,
            default: null
        }
    },
    setup(props) {
        const router = useRouter()
        const idea = ref<Idea | null>(null)

        const user = computed(() => store.state.user)
        const collection = computed(() => store.getters.collection)

        function login() {
            return store.dispatch(ACT_LOGIN)
        }

        function setCollection(id: string) {
            store.commit(MUT_SET_COLLECTION, id)
        }

        function navigate(name: string, opts?: any) {
            if (~name.indexOf("://")) return window.open(name, "_blank")
            router.push(Object.assign({ name }, opts))
        }

        async function markCompleted(completed: boolean) {
            if (!idea.value) return

            idea.value = await storeIdea({
                ...idea.value,
                completed
            })
        }

        async function next() {
            idea.value = await getIdea("random", collection.value && collection.value.id)
        }

        async function remove() {
            await removeIdea(idea.value!.id, idea.value!.collection)
            await next()
        }

        watch(() => props.collectionId, (id) => {
            if (id) setCollection(id)
        })

        onMounted(async () => {
            if (props.collectionId) setCollection(props.collectionId)
            idea.value = await getIdea("random", collection.value && collection.value.id)
        })

        return {
            idea,
            user,
            collection,
            login,
            navigate,
            markCompleted,
            next,
            remove
        }
    }
})
</script>
