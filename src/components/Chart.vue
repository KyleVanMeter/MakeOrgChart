<template>
    <div id="cont">
        <div id='circle' ref='stuff'>
            <h1> MakeOrgChart </h1>
            <h2> {{ msg }} </h2>
            <button v-on:click="addNodeEvent">Add Node</button>
            <input v-model="nodeData">
            <button v-on:click="addEdgeEvent">Add Edge</button>
            <input v-model="toNode">
            <input v-model="fromNode">
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
    private nodeData: string = ''
    private toNode: string = ''
    private fromNode: string = ''

    private _graph: Graph = new Graph()
    public addNodeEvent () {
        this._graph.insert(this.nodeData)
        console.log(this._graph)

        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(this._graph.toDot())
    }

    public addEdgeEvent () {
        this._graph.insertDirectedEdge(new Node(this.fromNode), new Node(this.toNode))
        console.log(this._graph)

        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(this._graph.toDot())
    }

    public getDim () {
        const div: HTMLDivElement = this.$refs.stuff as HTMLDivElement
        const doc: Document = document.getRootNode() as Document

        this.height = doc.body.clientHeight - div.clientHeight
        this.width = div.clientWidth
    }

    mounted () {
        this._graph = new Graph()
        this.getDim()
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
