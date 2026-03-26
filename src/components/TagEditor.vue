<template>
    <div class="tag-editor">
        <el-tag :key="String(tag)" v-for="tag in (modelValue as string[])" closable :disable-transitions="false" @close="handleClose(String(tag))">
            {{ tag }}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue"

export default defineComponent({
    name: "TagEditor",
    props: {
        modelValue: Array
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const inputVisible = ref(false)
        const inputValue = ref("")
        const saveTagInput = ref<any>(null)

        function handleClose(tag: string) {
            const tags = props.modelValue as string[]
            const i = tags.indexOf(tag)
            emit("update:modelValue", [...tags.slice(0, i), ...tags.slice(i + 1)])
        }

        function showInput() {
            inputVisible.value = true
            nextTick(() => {
                saveTagInput.value?.focus()
            })
        }

        function handleInputConfirm() {
            const tags = props.modelValue as string[]
            if (inputValue.value && !~tags.indexOf(inputValue.value)) {
                emit("update:modelValue", [...tags, inputValue.value])
            }
            inputVisible.value = false
            inputValue.value = ""
        }

        return {
            inputVisible,
            inputValue,
            saveTagInput,
            handleClose,
            showInput,
            handleInputConfirm
        }
    }
})
</script>
