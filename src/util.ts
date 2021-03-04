/* eslint-disable @typescript-eslint/member-delimiter-style */
import { Graph, Edge } from 'graphlib'
import * as dot from 'graphlib-dot'

type TableDim = {
    rows: number,
    cols: number
}

export type RetVal = {
    dot: string,
    nodeVal?: string
}

export interface HTMLMap {
    [nodeIndex: string]: string
}
export interface TableMap {
    [nodeIndex: string]: TableDim
}

/*
 * This class is unfortunately required despite graphlib-dot as that library
 * does not support HTML node labels.  Instead we must manually parse through
 * the generated dot file and place the labels ourselves.
 * TODO: Look into appending rather than replacing lines so as to support
 * node labels other than HTML that are supported by graphlib-dot
 */
export class NodeHTMLMap {
    private _map: HTMLMap = {}
    private _dim: TableMap = {}

    constructor() {
        this._map = {}
        this._dim = {}
        this.deleteItem = this.deleteItem.bind(this)
        this.addItem = this.addItem.bind(this)
        this.updateMap = this.updateMap.bind(this)
        this.getMapVal = this.getMapVal.bind(this)
        this.getMapDim = this.getMapDim.bind(this)
        this.isInMap = this.isInMap.bind(this)
    }

    public deleteItem = (index: string) => {
        delete this._map[index]
        delete this._dim[index]

        console.log('Deleted line: ', index)
    }

    public addItem = (index: string, line: string, row: number, col: number) => {
        console.log(this._map)
        console.log(this._dim)
        /* eslint-disable */
        this._dim[index] = { rows: row, cols: col }
        this._map[index] = line
        /* eslint-enable */

        console.log('Added line: ', index)
    }

    public updateMap = (index: string, line: string) => {
        console.log(this._map)
        if (this.isInMap(index)) {
            console.log('Updated line: ', index)
            /* eslint-disable */
            this._map[index] = line
            /* eslint-enable */
        } else {
            console.log(`Update failed.  ${index} not in map.`)
        }
    }

    public getMapVal = (index: string): string => {
        return this._map[index]
    }

    public getMapDim = (index: string): TableDim => {
        return this._dim[index]
    }

    public isInMap = (index: string) => {
        return (index in this._map)
    }
}

export class NodeGraph {
    private _graph = new Graph()
    private _nodeAttrMap = new NodeHTMLMap()

    constructor() {
        this._graph = new Graph()
        this._graph.setNode('graph', { lines: 'ortho', ranksep: '0.1' })
        this._nodeAttrMap = new NodeHTMLMap()
    }

    public getDot(): string {
        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            let currentNode: string = line.trim()

            if (this._nodeAttrMap.isInMap(currentNode)) {
                line = this._nodeAttrMap.getMapVal(currentNode)
            }

            return line
        }).join('\n')

        return temp
    }

    public addNode(nodeData: string, nodeTemplate: string, nodeRows: number, nodeCols: number): RetVal {
        this._graph.setNode(nodeData)

        let node: string | undefined
        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            let currentNode: string = line.trim()

            /*
             * As there are no duplicates it can not be the case that it is a new
             * node and already in the HTMLmap
             */
            if (currentNode === nodeData) {
                line += nodeTemplate
                node = currentNode

                this._nodeAttrMap.addItem(nodeData, line, nodeRows, nodeCols)
            } else if (this._nodeAttrMap.isInMap(currentNode)) {
                line = this._nodeAttrMap.getMapVal(currentNode)
            }

            return line
        }).join('\n')
        console.log(`Added node ${nodeData}`)

        return { dot: temp, nodeVal: node }
    }

    public addEdge(toNode: string, fromNode: string, nodeTemplate: string, nodeRows: number, nodeCols: number): RetVal {
        this._graph.setEdge(toNode, fromNode)

        let node: string | undefined
        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            let whichNode: string = ''
            let currentNode: string = line.trim()

            if (currentNode === fromNode) {
                node = currentNode
                whichNode = fromNode
            } else if (currentNode === toNode) {
                node = currentNode
                whichNode = toNode
            }

            if (this._nodeAttrMap.isInMap(currentNode)) {
                console.log(`${currentNode} is in map already with value: ${this._nodeAttrMap.getMapVal(currentNode)}`)
                line = this._nodeAttrMap.getMapVal(currentNode)
                whichNode = ''
            }

            if (whichNode !== '') {
                line += nodeTemplate

                this._nodeAttrMap.addItem(whichNode, line, nodeRows, nodeCols)
            }

            return line
        }).join('\n')
        console.log(`Added edge ${fromNode} -> ${toNode}`)

        return { dot: temp, nodeVal: node }
    }

    public deleteNode(delNode: string): RetVal {
        this._graph.removeNode(delNode)
        if (this._nodeAttrMap.isInMap(delNode)) {
            this._nodeAttrMap.deleteItem(delNode)
        }

        let node: string | undefined
        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            let currentNode: string = line.trim()

            if (currentNode === delNode) {
                node = currentNode
            }

            if (this._nodeAttrMap.isInMap(currentNode)) {
                line = this._nodeAttrMap.getMapVal(currentNode)
            }

            return line
        }).join('\n')
        console.log(`deleted node ${delNode}`)

        return { dot: temp, nodeVal: node }
    }

    public deleteEdge(toNode: string, fromNode: string): string {
        this._graph.removeEdge(toNode, fromNode)

        return dot.write(this._graph)
    }

    public collapseLeafNodes() {
        /*
         * Get the list of leaf nodes in the graph by checking if they have 0
         * children
         */
        const leafList: string[] = this._graph.nodes().filter((node: string) => {
            return (this._graph.successors(node) as string[]).length === 0
        })

        leafList.forEach((node: string) => {
            /*
             * Graphlib treats 'graph' as just another node.  In
             * graphviz 'graph' is a property of the the whole graph so
             * it must be explicitly ignored
             */
            if (node === 'graph') {
                return
            }

            // Assuming that the graph is strictly a tree (thus having 1 parent)
            // TODO: deal with corner-case of having a single-node graph
            const parent: string = (this._graph.predecessors(node) as string[])[0]

            // Only re-arrange nodes for several siblings
            const siblings: string[] = (this._graph.successors(parent) as string[])
            if (siblings.length > 1) {
                siblings.forEach((child: string, index: number) => {
                    /*
                     * We skip the first index as graphviz defines its initial
                     * placement.  We are defining the other nodes as aligned
                     * vertically to it.
                     */
                    if (index === 0) {
                        return
                    }

                    if (child === parent) {
                        return
                    }

                    // Disable placing constraint for existing edges
                    this._graph.setEdge(parent, child, { constraint: 'false' })
                    /*
                     * Add post-fix ordering invisible edges to siblings for
                     * correct layout
                     */
                    this._graph.setEdge(siblings[index - 1], child, { style: 'invis' })
                })
            }
        })

        console.log('result is ', dot.write(this._graph))
    }

    public expandLeafNodes() {
        this._graph.edges().forEach((edge: Edge) => {
            if (this._graph.edge(edge).style === 'invis') {
                this._graph.removeEdge(edge)
            }

            if (this._graph.edge(edge).constraint === 'false') {
                this._graph.setEdge(edge, { constraint: 'true' })
            }
        })
    }

    public clickHandler(nodeKey?: string): string {
        if (nodeKey === null || nodeKey === undefined) {
            return ""
        }

        let temp: string = dot.write(this._graph).split('\n').map((line: string) => {
            let currentNode = line.trim()

            if (this._nodeAttrMap.isInMap(currentNode)) {
                line = this._nodeAttrMap.getMapVal(currentNode)
            }

            if (currentNode === (nodeKey as string).trim()) {
                if (line.search('shape=box') !== -1) {
                    line = line.replace('shape=box', 'shape=plain')
                } else {
                    line = line.replace('shape=plain', 'shape=box')
                }

                this._nodeAttrMap.updateMap(currentNode, line)
            } else if (line.search('shape=box') !== -1) {
                line = line.replace('shape=box', 'shape=plain')
                this._nodeAttrMap.updateMap(currentNode, line)
            }

            return line
        }).join('\n')

        return temp
    }
}

export function HTMLWrapper(inner: string): string {
    return ` [shape=plaintext, label=<\n${inner}>]`
}

export function HTMLListBuilder<T extends any>(data: Array<T>): string {
    let arrString: string = `<table>\n`
    let numRows = data.length

    for (let n = 0; n < numRows; n++) {
        arrString +=
            `  <tr>\n    <td> ${data[n]} </td>\n  </tr>\n`
    }
    arrString += `</table>`

    return arrString
}

export function HTMLEmptyTable(numRows: number, numCols: number): string {
    let arrString: string = `<table>\n`
    for (let n = 0; n < numRows; n++) {
        arrString += `<tr>\n`
        for (let m = 0; m < numCols; m++) {
            console.log(m, ' ', n)
            arrString += `    <td> ? </td>\n`
        }
        arrString += `</tr>\n`
    }
    arrString += `</table>\n`

    return arrString
}

export function HTMLTableBuilder<T>(numRows: number, numCols: number, data: Array<T>): string {
    let arrString: string = `<table>\n`
    for (let n = 0; n < numRows; n++) {
        arrString += `<tr>\n`
        for (let m = 0; m < numCols; m++) {
            console.log(m, ' ', n)
            if ((numCols * n) + m < data.length - 1) {
                arrString += `    <td> ${data[(m * n) + m]} </td>\n`
            } else {
                arrString += `    <td> ? </td>\n`
            }
        }
        arrString += `</tr>\n`
    }
    arrString += `</table>\n`

    return arrString
}