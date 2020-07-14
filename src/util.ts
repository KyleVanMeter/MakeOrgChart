/* eslint-disable @typescript-eslint/member-delimiter-style */
type TableDim = {
    rows: number,
    cols: number
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