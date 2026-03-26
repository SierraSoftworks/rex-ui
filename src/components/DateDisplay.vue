<template>
    <time :datetime="value">{{ formatted }}</time>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useStore } from "vuex"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

export default defineComponent({
    name: "DateDisplay",
    props: {
        value: {
            required: true
        },
        format: {
            type: String,
            required: false,
            default: "YYYY-MM-DD HH:mm:ss"
        }
    },
    setup(props) {
        const store = useStore()

        const utcEnabled = computed(() => store.state.utc)

        const formatted = computed(() => {
            if (utcEnabled.value)
                return dayjs.utc(props.value as string).format(props.format)
            else
                return dayjs.utc(props.value as string).local().format(props.format)
        })

        return { formatted }
    }
})
</script>
