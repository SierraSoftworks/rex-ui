<template>
    <span v-html="compiledHtml"></span>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"

const markdownConverter = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: (src: string, lang: string) => {
        if (!lang) return src

        try {
            return hljs.highlight(src, { language: lang }).value
        } catch (err) {
            console.debug(`Unknown language '${lang}' used in Markdown`)
            return src
        }
    }
})

export default defineComponent({
    name: "MarkdownDisplay",
    props: {
        value: String,
        inline: {
            required: false,
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const compiledHtml = computed(() => {
            if (props.inline) return markdownConverter.renderInline(props.value || "")
            return markdownConverter.render(props.value || "")
        })

        return { compiledHtml }
    }
})
</script>
