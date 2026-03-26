<template>
    <div class="idea">
        <h2 class="idea__title">
            {{ idea && idea.name }}

            <el-tag v-if="idea && idea.completed" type="success">
                <el-icon><Check /></el-icon>
            </el-tag>

            <el-tag v-for="tag in (idea && idea.tags || [])" :key="tag">{{ tag }}</el-tag>
        </h2>

        <MarkdownDisplay class="idea__description" :value="idea && idea.description || ''"></MarkdownDisplay>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Check } from "@element-plus/icons-vue"
import MarkdownDisplay from "./MarkdownDisplay.vue"

export default defineComponent({
    name: "IdeaDisplay",
    components: {
        MarkdownDisplay,
        Check
    },
    props: {
        idea: Object
    }
})
</script>
