<template>
    <div>
        <p v-if="idea" style="float: right; clear: both; padding: 20px;">
            <el-button v-if="allowComplete && !idea.completed" :icon="Check" @click="$emit('complete')">
                Mark as Done
            </el-button>

            <el-button v-if="allowIncomplete && idea.completed" :icon="VideoPause" @click="$emit('incomplete')">
                Undo
            </el-button>

            <el-button v-if="allowDelete" :icon="Delete" @click="$emit('delete')">
                Delete
            </el-button>

            <el-button v-if="allowNext" :icon="ArrowRight" @click="$emit('next')">
                Next
            </el-button>
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Check, VideoPause, Delete, ArrowRight } from "@element-plus/icons-vue"

export default defineComponent({
    name: "IdeaControls",
    components: {
        Check,
        VideoPause,
        Delete,
        ArrowRight
    },
    props: {
        idea: Object,
        allowComplete: {
            type: Boolean,
            default: false
        },
        allowIncomplete: {
            type: Boolean,
            default: false
        },
        allowNext: {
            type: Boolean,
            default: false
        },
        allowDelete: {
            type: Boolean,
            default: false
        }
    },
    emits: ["complete", "incomplete", "next", "delete"],
    setup() {
        return { Check, VideoPause, Delete, ArrowRight }
    }
})
</script>
