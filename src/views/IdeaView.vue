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
                :allow-next="false"></IdeaControls>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import { store, MUT_SET_COLLECTION, ACT_LOGIN } from "../store"
import { getIdea, Idea, storeIdea, removeIdea } from "../api/ideas"
import IdeaDisplay from "../components/IdeaDisplay.vue"
import IdeaControls from "../components/IdeaControls.vue"

export default defineComponent({
    name: "IdeaView",
    components: {
        IdeaDisplay,
        IdeaControls
    },
    props: {
        collectionId: {
            type: String,
            required: true
        },
        ideaId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const router = useRouter()
        const idea = ref<Idea | null>(null)

        const user = computed(() => store.state.user)

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

        async function markCompleted(complete: boolean) {
            if (!idea.value) return

            idea.value = await storeIdea({
                ...idea.value,
                completed: complete
            })
        }

        async function remove() {
            await removeIdea(idea.value!.id, idea.value!.collection)
            navigate("home", { params: { collectionId: idea.value!.collection } })
        }

        async function loadIdea() {
            idea.value = await getIdea(props.ideaId, props.collectionId)
        }

        watch(() => props.collectionId, (id) => {
            if (id) setCollection(id)
        })

        watch(user, async (newUser) => {
            if (newUser && !idea.value) {
                await loadIdea()
            }
        })

        onMounted(async () => {
            if (props.collectionId) setCollection(props.collectionId)
            if (user.value) {
                await loadIdea()
            }
        })

        return {
            idea,
            user,
            login,
            markCompleted,
            remove
        }
    }
})
</script>
