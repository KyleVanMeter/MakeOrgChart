/* eslint-disable quotes */
/* eslint quotes 0 */
/* eslint quotes off */
/* eslint-disable */
<template>
    <div id="cont">
        <h1> MakeOrgChart </h1>
        <div id='circle' ref='stuff'>
            <button v-on:click="collapseLeafNodes">Click Me :)</button>
            <button v-on:click="() => {
                showAdd = !showAdd
                showEdg = false
                showDel = false
                showTmp = false
                }">Add Node</button>

            <button v-on:click="() => {
                showAdd = false
                showEdg = !showEdg
                showDel = false
                showTmp = false
                }">Add Edge</button>

            <button v-on:click="() => {
                showAdd = false
                showEdg = false
                showDel = !showDel
                showTmp = false
                }">Delete Node</button>

            <button v-on:click="() => {
                showAdd = false
                showEdg = false
                showDel = false
                showTmp = !showTmp
                }">Edit Template</button>

            <div v-if="showTmp">
                <button class="inner_btn" v-on:click="blankTemplate">Edit Template</button>
                <textarea rows="10" cols="45" v-model="nodeTemplate"></textarea>
                <br>
                <label for="rows"> rows </label>
                <input id="rows" v-model="inputRows">
                <label for="columns"> columns </label>
                <input id="columns" v-model="inputCols">
            </div>

            <div v-if="showAdd">
                <button class="inner_btn" v-on:click="addNodeEvent">Add Node</button>
                <input v-model="nodeData">
            </div>

            <div v-if="showEdg">
                <button class="inner_btn" v-on:click="addEdgeEvent">Add Edge</button>
                <input v-model="toNode">
                <input v-model="fromNode">
            </div>

            <div v-if="showDel">
                <button class="inner_btn" v-on:click="deleteNodeEvent">Delete Node</button>
                <input v-model="delNode">
            </div>
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
import { HTMLMap, HTMLTableBuilder, HTMLListBuilder, HTMLEmptyTable, HTMLWrapper, NodeHTMLMap, NodeGraph, RetVal } from '../util'
import * as dot from 'graphlib-dot'
import { select, selectAll, Selection } from 'd3-selection'

@Component
export default class Chart extends Vue {
    private height: number = 0
    private width: number = 0

    private nodeRows: number = 1
    private nodeCols: number = 1
    private inputRows: number = 1
    private inputCols: number = 1

    private currNode: string = ''
    private prevNode: string = ''

    private nodeData: string = ''
    private toNode: string = ''
    private fromNode: string = ''
    private delNode: string = ''

    private showAdd: boolean = false
    private showDel: boolean = false
    private showEdg: boolean = false
    private showTmp: boolean = false

    private nodeTemplate: string = HTMLWrapper(HTMLEmptyTable(this.nodeRows, this.nodeCols))

    private _nodeAttrMap: NodeHTMLMap = new NodeHTMLMap()
    private _nodeGraph: NodeGraph = new NodeGraph()

    public blankTemplate () {
        this.nodeRows = this.inputRows
        this.nodeCols = this.inputCols
        this.nodeTemplate = HTMLWrapper(HTMLEmptyTable(this.nodeRows, this.nodeCols))
    }

    public setCurrentNode (node: string) {
        this.prevNode = this.currNode
        this.currNode = node
    }

    public render = (temp: string) => {
        this.getDim()
        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(temp)
        .on('end', this.interactive)
    }

    public collapseLeafNodes () {
        this._nodeGraph.collapseLeafNodes()
    }

    public interactive () {
        let nodes = selectAll('.node')
        nodes.on('click', event => {
            const nodeKey: string = document.getElementById(event.attributes.id).__data__.key
            this.render(this._nodeGraph.clickHandler(nodeKey))
        })

        console.log(`current: ${this.currNode}, previous: ${this.prevNode}`)
    }

    public deleteNodeEvent () {
        let res: RetVal = this._nodeGraph.deleteNode(this.delNode)
        if (res.nodeVal !== undefined) {
            this.setCurrentNode(res.nodeVal as string)
        }

        this.render(res.dot as string)
    }

    public addNodeEvent () {
        let res: RetVal = this._nodeGraph.addNode(this.nodeData, this.nodeTemplate, this.nodeRows, this.nodeCols)
        if (res.nodeVal !== undefined) {
            this.setCurrentNode(res.nodeVal as string)
        }

        this.render(res.dot as string)
    }

    public addEdgeEvent () {
        let res: RetVal = this._nodeGraph.addEdge(this.toNode, this.fromNode, this.nodeTemplate, this.nodeRows, this.nodeCols)

        if (res.nodeVal !== undefined) {
            this.setCurrentNode(res.nodeVal as string)
        }

        this.render(res.dot as string)
    }

    public getDim = () => {
        const div: HTMLDivElement = this.$refs.stuff as HTMLDivElement
        const doc: Document = document.getRootNode() as Document

        this.height = doc.body.clientHeight - div.clientHeight
        this.width = div.clientWidth
    }

    mounted () {
        this.getDim()
        this._nodeAttrMap = new NodeHTMLMap()
        this._nodeGraph = new NodeGraph()

        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(this._nodeGraph.getDot())
        .on('end', this.interactive)
    }
}
</script>

<style scoped>

.inner_btn {
    border-radius: 5px;
    background-color: lightblue;
}

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
