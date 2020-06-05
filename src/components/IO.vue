<template>
    <div id="editor">
        <textarea v-model="input" debounce="3000"></textarea>
        <div v-html="compiledMarkdown"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import marked from 'marked'
import _ from 'lodash'

@Component
export default class IO extends Vue {
    public input: string = '# hello'
    get compiledMarkdown (): string {
        return marked(this.input, { sanitize: true })
    }

    public update () {
        _.debounce((e) => {
            this.input = e.target.value
            console.log(this.input)
        }, 300)
    }
}
</script>