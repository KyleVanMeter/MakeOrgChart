/* eslint-disable space-before-function-paren */
/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/no-array-constructor */
import { IGraph, IGraphNode, IGraphEdge } from './IGraph'

export class Node implements IGraphNode {
    inDegree: number
    outDegree: number

    constructor(public data: any) {
        this.inDegree = 0
        this.outDegree = 0
    }
}

export class Edge implements IGraphEdge {
    isDirected: boolean

    constructor(public to: Node, public from: Node) {
        this.isDirected = false
    }

    isConnected(n: Node): boolean {
        return (n === this.to || n === this.from)
    }
}

export class Graph implements IGraph {
    private _nodes: Array<Node>
    private _edges: Array<Edge>
    private _size: number

    constructor () {
        this._edges = new Array()
        this._nodes = new Array()
        this._size = 0
    }

    size (): number {
        return this._size
    }

    isEmpty(): boolean {
        return this._size === 0
    }

    nodeCount(): number {
        return this._nodes.length
    }

    edgeCount(): number {
        return this._edges.length
    }

    nodes(): Node[] {
        return this._nodes.slice()
    }

    edges(): Edge[] {
        return this._edges.slice()
    }

    degree(n: Node): number {
        return n.outDegree + n.inDegree
    }

    neighbors(n: Node): Node[] {
        /*
         * Filter the edges only connected to n, and
         * map those edges to their other nodes
         */
        return this._edges.filter((edge: Edge) => {
            return edge.isConnected(n)
        }).map((edge: Edge) => {
            return this.nextNode(n, edge)
        }, this)
    }

    connectedEdges(n: Node): Edge[] {
        return this._edges.filter((edge: Edge) => {
            return this.edgeToNode(edge).indexOf(n) >= 0
        }, this)
    }

    edgeToNode(n: Edge): Node[] {
        return [n.from, n.to]
    }

    nextNode(n: Node, e: Edge): Node {
        if (n === e.from) {
            return e.to
        } else if (n === e.to) {
            return e.from
        } else {
            throw new Error('Edge is not connected to node')
        }
    }

    isAdjacent(n: Node, m: Node): boolean {
        let target: Node = this.degree(n) <= this.degree(m) ? n : m

        return true
    }

    directedEdges(n: Node): Edge[] {
        return this._edges.filter((edge: Edge) => {
            return edge.isDirected
        })
    }

    undirectedEdges(n: Node): Edge[] {
        return this._edges.filter((edge: Edge) => {
            return !edge.isDirected
        })
    }

    edgeTo(e: Edge): Node {
        return e.to
    }

    edgeFrom(e: Edge): Node {
        return e.from
    }

    inDegree(n: Node): number {
        return n.inDegree
    }

    outDegree(n: Node): number {
        return n.outDegree
    }

    inDegreeEdges(n: Node): Edge[] {
        return this._edges.filter((edge: Edge) => {
            return edge.to === n
        })
    }

    outDegreeEdges(n: Node): Edge[] {
        return this._edges.filter((edge: Edge) => {
            return edge.from === n
        })
    }

    inNeighborNodes(n: Node): Node[] {
        return this.inDegreeEdges(n).map((edge: Edge) => {
            return edge.to
        })
    }

    outNeighborNodes(n: Node): Node[] {
        return this.inDegreeEdges(n).map((edge: Edge) => {
            return edge.from
        })
    }

    insertEdge(n: Node, m: Node): void {
        let edge: Edge = new Edge(n, m)

        n.outDegree++
        m.inDegree++

        this._edges.push(edge)
        this._size++
    }

    insertDirectedEdge(n: Node, m: Node): void {
        let edge: Edge = new Edge(n, m)
        edge.isDirected = true

        n.outDegree++
        m.inDegree++

        this._edges.push(edge)
        this._size++
    }

    insert(n: any): void {
        let node: Node = new Node(n)

        this._nodes.push(node)
        this._size++
    }

    insertNode(n: Node): void {
        this._nodes.push(n)
        this._size++
    }

    removeNode(n: Node): void {
        let index: number = this._nodes.indexOf(n)

        if (index < 0) {
            throw new Error('Node does not exist in graph')
        }

        this.connectedEdges(n).forEach((edge: Edge) => {
            this.removeEdge(edge)
        }, this)

        this._nodes.splice(index, 1)
        this._size--
    }

    removeEdge(e: Edge): void {
        let index: number = this._edges.indexOf(e)

        if (index < 0) {
            throw new Error('Edge does not exist in graph')
        }

        e.from.outDegree--
        e.to.inDegree--

        this._edges.splice(index, 1)
        this._size--
    }

    makeUndirected(e: Edge): void {
        e.isDirected = false
    }

    reverseDirection(e: Edge): void {
        let temp: Node = e.from

        this.setFrom(e, e.to)
        this.setTo(e, temp)
    }

    setFrom(e: Edge, n: Node): void {
        e.from.outDegree--

        e.from = n
        e.from.outDegree++
    }

    setTo(e: Edge, n: Node): void {
        e.to.inDegree--

        e.to = n
        e.to.inDegree++
    }
}