<template>
    <div class='circle'>
        <h1> Circles </h1>
        <h2> {{ msg }} </h2>
    <svg
    :height='height'
    :width='width'
    >
    </svg>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import * as d3 from 'd3'

@Component
export default class Chart extends Vue {
    private msg: string = 'Chart msg'
    private height: number = 500
    private width: number = 600

    mounted () {
        d3.select('svg')
        .append('circle')
        .attr('r', 5)
        .attr('cx', this.width / 3.0)
        .attr('cy', this.height / 3.0)
        .attr('fill', 'red')
    }
}
</script>
