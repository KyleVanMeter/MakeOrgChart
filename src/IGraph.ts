
export interface IGraphNode {
    data: any
}

export interface IGraphEdge {
    isDirected: boolean
    to: IGraphNode
    from: IGraphNode
    isConnected(n: IGraphNode): boolean
}

export interface IGraph {
    nodeCount(): number
    edgeCount(): number
    nodes(): IGraphNode[]
    edges(): IGraphEdge[]
    degree(n: IGraphNode): number
    neighbors(n: IGraphNode): IGraphNode[]
    connectedEdges(n: IGraphNode): IGraphEdge[]
    edgeToNode(n: IGraphEdge): IGraphNode[]
    nextNode(n: IGraphNode, e: IGraphEdge): IGraphNode
    isAdjacent(n: IGraphNode, m: IGraphNode): boolean

    directedEdges(n: IGraphNode): IGraphEdge[]
    undirectedEdges(n: IGraphNode): IGraphEdge[]
    edgeTo(e: IGraphEdge): IGraphNode
    edgeFrom(e: IGraphEdge): IGraphNode
    inDegree(n: IGraphNode): number
    outDegree(n: IGraphNode): number
    inDegreeEdges(n: IGraphNode): IGraphEdge[]
    outDegreeEdges(n: IGraphNode): IGraphEdge[]
    inNeighborNodes(n: IGraphNode): IGraphNode[]
    outNeighborNodes(n: IGraphNode): IGraphNode[]

    insertEdge(n: IGraphNode, m: IGraphNode): void
    insertDirectedEdge(n: IGraphNode, m: IGraphNode): void
    insertNode(n: IGraphNode): void
    removeNode(n: IGraphNode): void
    removeEdge(e: IGraphEdge): void
    makeUndirected(e: IGraphEdge): void
    reverseDirection(e: IGraphEdge): void
    setFrom(e: IGraphEdge, n: IGraphNode): void
    setTo(e: IGraphEdge, n: IGraphNode): void
}