/* eslint-disable quotes */
/* eslint quotes 0 */
/* eslint quotes off */
/* eslint-disable */
<template>
    <div id="cont">
        <h1> MakeOrgChart </h1>
        <div id='circle' ref='stuff'>
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
                <input id="rows" v-model="nodeRows">
                <label for="columns"> columns </label>
                <input id="columns" v-model="nodeCols">
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
import { HTMLMap, HTMLTableBuilder, HTMLListBuilder, HTMLEmptyTable, HTMLWrapper } from '../util'
import * as dot from 'graphlib-dot'
import { select, selectAll, Selection } from 'd3-selection'

@Component
export default class Chart extends Vue {
    private height: number = 0
    private width: number = 0

    private nodeRows: number = 1
    private nodeCols: number = 1

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
    /*
    private nodeTemplate: string = ` [shape=plain, label=<
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
                */

    private _graph: Graph = new Graph()
    private _attrMap: HTMLMap = {}

    public updateMap = (index: string, line: string) => {
        /* eslint-disable */
        this._attrMap[index] = line
        /* eslint-enable */
        console.log('Updated line: ', index)
    }

    public getMapVal = (index: string) => {
        return this._attrMap[index]
    }

    public isInMap = (index: string) => {
        for (let [key, value] of Object.entries(this._attrMap)) {
            if (index === key) {
                return true
            }
        }

        return false
    }

    public blankTemplate () {
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

    public interactive () {
        let nodes = selectAll('.node')
        nodes.on('click', event => {
            const nodeKey: string = document.getElementById(event.attributes.id).__data__.key
            let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
                let currentNode = line.trim()

                if (this.isInMap(currentNode)) {
                    line = this.getMapVal(currentNode)
                }

                if (currentNode === nodeKey.trim()) {
                    if (line.search('shape=box') !== -1) {
                        line = line.replace('shape=box', 'shape=plain')
                    } else {
                        line = line.replace('shape=plain', 'shape=box')
                    }

                    this.updateMap(currentNode, line)
                } else if (line.search('shape=box') !== -1) {
                    line = line.replace('shape=box', 'shape=plain')
                    this.updateMap(currentNode, line)
                }

                return line
            }).join('\n')

            this.render(temp)
        })

        console.log(`current: ${this.currNode}, previous: ${this.prevNode}`)
    }

    public deleteNodeEvent () {
        this._graph.removeNode(this.delNode)
        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            let currentNode: string = line.trim()
            if (currentNode === this.delNode) {
                this.setCurrentNode(currentNode)
                this.updateMap(currentNode, '')
                return ''
            }

            if (this.isInMap(currentNode)) {
                line = this.getMapVal(currentNode)
            }

            return line
        }).join('\n')
        console.log('del')

        this.render(temp)
    }

    public addNodeEvent () {
        this._graph.setNode(this.nodeData)

        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            let currentNode: string = line.trim()

            /*
             * As there are no duplicates it can not be the case that it is a new
             * node and already in the HTMLmap
             */
            if (currentNode === this.nodeData) {
                this.setCurrentNode(currentNode)
                line += this.nodeTemplate

                this.updateMap(this.nodeData, line)
            } else if (this.isInMap(currentNode)) {
                line = this.getMapVal(currentNode)
            }

            return line
        }).join('\n')

        this.render(temp)
    }

    public addEdgeEvent () {
        this._graph.setEdge(this.toNode, this.fromNode)
        console.log(dot.write(this._graph))
        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            let whichNode: string = ''
            let currentNode: string = line.trim()

            if (currentNode === this.fromNode) {
                this.setCurrentNode(currentNode)
                whichNode = this.fromNode
            } else if (currentNode === this.toNode) {
                this.setCurrentNode(currentNode)
                whichNode = this.toNode
            }

            if (this.isInMap(currentNode)) {
                console.log(currentNode, " is in map already with value: ", this.getMapVal(currentNode))
                line = this.getMapVal(currentNode)
                whichNode = ''
            }

            if (whichNode !== '') {
                line += this.nodeTemplate

                this.updateMap(whichNode, line)
            }

            return line
        }).join('\n')
        console.log(temp)

        this.render(temp)
    }

    public getDim = () => {
        const div: HTMLDivElement = this.$refs.stuff as HTMLDivElement
        const doc: Document = document.getRootNode() as Document

        this.height = doc.body.clientHeight - div.clientHeight
        this.width = div.clientWidth
    }

    mounted () {
        this.getDim()
        this._graph = new Graph()

        d3.select('#graph')
        .graphviz()
        .height(this.height)
        .width(this.width)
        .renderDot(dot.write(this._graph))
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
