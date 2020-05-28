<template>
    <div id="cont">
        <div id='circle' ref='stuff'>
            <h1> Circles </h1>
            <h2> {{ msg }} </h2>
        </div>
        <div id='graph'>
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import * as d3 from 'd3'
import 'd3-graphviz'
import { Node, Graph } from '../Graph'

@Component
export default class Chart extends Vue {
    private msg: string = 'Chart msg'
    private height: number = 500
    private width: number = 600
    public getDim () {
        const div: HTMLDivElement = this.$refs.stuff as HTMLDivElement
        const doc: Document = document.getRootNode() as Document

        this.height = doc.body.clientHeight - div.clientHeight
        this.width = div.clientWidth
    }

    mounted () {
        let g: Graph = new Graph()
        let n: Node = new Node('0')
        let m: Node = new Node('1')
        g.insertNode(n)
        g.insertNode(m)
        g.insertDirectedEdge(n, m)
        g.insertDirectedEdge(m, g.insert('3'))
        console.log(g.toDot())

        this.getDim()
        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(g.toDot())
    }
}
</script>

<style scoped>

div#circle span {
    width: 100%;
    height: 100%;
    position: absolute;
}

div#graph span {
    width: 100%;
    height: 100%;
    position: absolute;
}

</style>
