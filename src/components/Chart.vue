/* eslint-disable quotes */
/* eslint quotes 0 */
/* eslint quotes off */
/* eslint-disable */
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
            <button v-on:click="deleteNodeEvent">Delete Node</button>
            <input v-model="delNode">
        </div>
        <div id='graph'>
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import * as d3 from 'd3'
import 'd3-graphviz'
import { Graph } from 'graphlib'
import * as dot from 'graphlib-dot'

@Component
export default class Chart extends Vue {
    private msg: string = 'Chart msg'
    private height: number = 500
    private width: number = 600
    private nodeData: string = ''
    private toNode: string = ''
    private fromNode: string = ''
    private delNode: string = ''

    private _graph: Graph = new Graph()

    public deleteNodeEvent () {
        this._graph.removeNode(this.delNode)
        console.log('deleted!')

        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(dot.write(this._graph))
    }

    public addNodeEvent () {
        this._graph.setNode(this.nodeData)
        console.log(this._graph)

        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(dot.write(this._graph))
    }

    public addEdgeEvent () {
        this._graph.setEdge(this.toNode, this.fromNode)
        console.log(dot.write(this._graph))
        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            if (line.trim() === this.fromNode) {
                line += ` [shape=plaintext, label=<
                <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                    <TR>
                        <TD>a</TD>
                    </TR>
                    <TR>
                        <TD>b</TD>
                    </TR>
                    <TR>
                        <TD>c</TD>
                    </TR>
                </TABLE>>]`
            }

            return line
        }).join('\n')
        console.log(temp)

        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(temp)
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

        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(dot.write(this._graph))
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
