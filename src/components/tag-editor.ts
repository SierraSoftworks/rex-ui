import Vue from "vue"
import Component from "vue-class-component"
import * as template from "text!./tag-editor.html"

@Component({
    template,
    props: {
        value: Array
    }
})
export default class TagEditor extends Vue {
    value!: string[]

    inputVisible: boolean = false
    inputValue: string = ""

    handleClose(tag) {
        const i = this.value.indexOf(tag);

        this.$emit("input", [...this.value.slice(0, i), ...this.value.slice(i + 1)])
    }

    showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
            (<any>this.$refs.saveTagInput).$refs.input.focus();
        });
    }

    handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue && !~this.value.indexOf(inputValue)) {
            this.$emit("input", [...this.value, inputValue])
        }
        this.inputVisible = false;
        this.inputValue = '';
    }
}