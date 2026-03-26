<template>
    <div class="fill">
        <div class="center">
            <h1>
                <el-avatar :size="50" :src="avatarUrl">
                    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="No avatar was found">
                </el-avatar>

                Invite {{ user && user.firstName || 'Someone' }}
            </h1>

            <el-input v-model="emailAddress" placeholder="Email Address" clearable :prefix-icon="Message">
                <template #prepend>
                    <el-select v-model="role" placeholder="Role">
                        <el-option v-for="r in roles" :key="r" :value="r" :label="r"></el-option>
                    </el-select>
                </template>
            </el-input>

            <p style="text-align: center;">
                <el-button v-if="user" @click="inviteUser">Invite</el-button>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { Message } from "@element-plus/icons-vue"
import { store, MUT_SET_COLLECTION } from "../store"
import { User, getUser } from "../api/users"
import { setRoleAssignment, Role } from "../api/role-assignments"

export default defineComponent({
    name: "InviteView",
    components: {
        Message
    },
    props: {
        collectionId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const router = useRouter()
        const user = ref<User | null>(null)
        const emailAddress = ref("")
        const noSuchUser = ref(false)
        const role = ref<Role>("Viewer")
        const roles: Role[] = ["Owner", "Contributor", "Viewer"]

        let debounceHandle: ReturnType<typeof setTimeout> | null = null

        const avatarUrl = computed(() => {
            if (!user.value) return "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            return `https://www.gravatar.com/avatar/${user.value.emailHash}?s=50`
        })

        function setCollection(id: string) {
            store.commit(MUT_SET_COLLECTION, id)
        }

        function navigate(name: string, opts?: any) {
            if (~name.indexOf("://")) return window.open(name, "_blank")
            router.push(Object.assign({ name }, opts))
        }

        async function inviteUser() {
            await setRoleAssignment({
                collectionId: props.collectionId,
                userId: user.value!.id,
                role: role.value
            })

            navigate("manageCollection", { params: { collectionId: props.collectionId } })
        }

        watch(emailAddress, (address) => {
            noSuchUser.value = false
            user.value = null
            if (debounceHandle) clearTimeout(debounceHandle)

            debounceHandle = setTimeout(() => {
                debounceHandle = null
                getUser(address).then(u => user.value = u).catch(() => {
                    user.value = null
                    noSuchUser.value = true
                })
            }, 1000)
        })

        watch(() => props.collectionId, (id) => {
            if (id) setCollection(id)
        })

        onMounted(() => {
            if (props.collectionId) setCollection(props.collectionId)
        })

        onUnmounted(() => {
            if (debounceHandle) clearTimeout(debounceHandle)
        })

        return {
            user,
            emailAddress,
            noSuchUser,
            role,
            roles,
            avatarUrl,
            inviteUser,
            Message
        }
    }
})
</script>
