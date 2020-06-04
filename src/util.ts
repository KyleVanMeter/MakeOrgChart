/* eslint-disable @typescript-eslint/member-delimiter-style */
export interface HTMLMap {
    [nodeIndex: string]: string
}

function HTMLTableBuilder<T> (numRows: number, numCols: number, data: Array<T>): string {
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