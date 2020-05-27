<template>
    <div class='circle' ref='stuff'>
        <h1> Circles </h1>
        <h2> {{ msg }} </h2>
        <div id='graph'>
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import * as d3 from 'd3'
import 'd3-graphviz'

@Component
export default class Chart extends Vue {
    private msg: string = 'Chart msg'
    private height: number = 500
    private width: number = 600
    public getDim () {
        const div: HTMLDivElement = this.$refs.stuff as HTMLDivElement
        this.height = div.clientHeight
        this.width = div.clientWidth
    }

    mounted () {
        this.getDim()
        d3.select('#graph')
        .graphviz()
        .renderDot('digraph  {a -> b}')
    }
}
</script>
