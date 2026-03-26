<template>
    <div class="fill">
        <div class="center" v-if="!collection">
            Oops, it looks like the collection you're looking for could not be found.
        </div>

        <el-container v-if="collection">
            <el-main>
                <el-row :gutter="40">
                    <el-col :span="16">
                        <h3>Ideas</h3>

                        <el-table :data="ideas"
                            :row-class-name="ideaRowClassName">
                            <el-table-column prop="name"
                                label="Name">
                            </el-table-column>
                            <el-table-column prop="tags"
                                label="Tags">
                                <template #default="scope">
                                    <el-tag
                                        v-for="tag in scope.row.tags"
                                        :key="scope.row.id + ':' + tag"
                                        disable-transitions>{{ tag }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column :width="200">
                                <template #default="scope">
                                    <el-button
                                        size="small"
                                        v-if="!scope.row.completed"
                                        :icon="Check"
                                        @click="markComplete(scope.row, true)"></el-button>
                                    <el-button
                                        size="small"
                                        v-if="scope.row.completed"
                                        :icon="VideoPause"
                                        @click="markComplete(scope.row, false)"></el-button>
                                    <el-button
                                        size="small"
                                        type="danger"
                                        :icon="Delete"
                                        @click="deleteIdea(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>

                    <el-col :span="8">
                        <h3>
                            Users

                            <el-button type="primary" circle @click="navigate('inviteUser', { params: { collectionId } })" :icon="Plus"></el-button>
                        </h3>

                        <el-table :data="users">
                            <el-table-column prop="userId"
                                label="User ID">
                            </el-table-column>
                            <el-table-column prop="role"
                                label="Role">
                            </el-table-column>
                            <el-table-column :width="200">
                                <template #default="scope">
                                    <el-button
                                        size="small"
                                        type="danger"
                                        :icon="Delete"
                                        @click="deleteUser(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import { Check, VideoPause, Delete, Plus } from "@element-plus/icons-vue"
import { store, MUT_SET_COLLECTION, MUT_REQUEST_ERROR } from "../store"
import { Collection, getCollection } from "../api/collections"
import { Idea, getIdeas, storeIdea, removeIdea } from "../api/ideas"
import { RoleAssignment, getRoleAssignments, removeRoleAssignment } from "../api/role-assignments"

export default defineComponent({
    name: "CollectionView",
    components: {
        Check,
        VideoPause,
        Delete,
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
        const collection = ref<Collection | null>(null)
        const ideas = ref<Idea[]>([])
        const users = ref<RoleAssignment[]>([])

        async function setCollection(id: string) {
            store.commit(MUT_SET_COLLECTION, id)

            await Promise.all([
                getCollection(id).then(c => collection.value = c),
                getRoleAssignments(id).then(u => users.value = u),
                getIdeas(id).then(i => ideas.value = i),
            ]).catch(err => store.commit(MUT_REQUEST_ERROR, err))
        }

        function navigate(name: string, opts?: any) {
            if (~name.indexOf("://")) return window.open(name, "_blank")
            router.push(Object.assign({ name }, opts))
        }

        async function markComplete(idea: Idea, complete: boolean) {
            if (!idea) return

            const i = ideas.value.indexOf(idea)
            if (!~i) return

            ideas.value.splice(i, 1, await storeIdea({
                ...idea,
                completed: complete
            }))
        }

        async function deleteIdea(idea: Idea) {
            if (!idea) return

            const i = ideas.value.indexOf(idea)
            if (!~i) return

            await removeIdea(idea.id, idea.collection)
            ideas.value.splice(i, 1)
        }

        async function deleteUser(user: RoleAssignment) {
            if (!user) return

            const i = users.value.indexOf(user)
            if (!~i) return

            await removeRoleAssignment(user.collectionId, user.userId)
            users.value.splice(i, 1)
        }

        function ideaRowClassName({ row }: { row: Idea; rowIndex: number }) {
            if (row.completed) return "success-row"
            return ""
        }

        watch(() => props.collectionId, (id) => {
            if (id) setCollection(id)
        })

        onMounted(() => {
            if (props.collectionId) setCollection(props.collectionId)
        })

        return {
            collection,
            ideas,
            users,
            collectionId: props.collectionId,
            navigate,
            markComplete,
            deleteIdea,
            deleteUser,
            ideaRowClassName,
            Check,
            VideoPause,
            Delete,
            Plus
        }
    }
})
</script>
