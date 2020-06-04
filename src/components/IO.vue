<template>
    <h1> test {{msg}} </h1>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class IO extends Vue {
    @Prop() private msg!: string
}
</script>