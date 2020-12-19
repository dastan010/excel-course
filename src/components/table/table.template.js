import {toInlineStyles} from '../../core/utils'
import {defaultStyles} from '@/constants'
import {parse} from '@core/parse'

const CODES = {
    A: 65,
    Z: 90
}

const DEFAULT_WIDTH = 120,
      DEFAULT_HEIGHT = 24

function getWidth(state, index) {
    return (state[index] || DEFAULT_WIDTH) + 'px'
}

function getHeight(state, index) {
    return (state[index] || DEFAULT_HEIGHT) + 'px'
}

function toCell(state, row) {
    return function(_, col) {
        const width = getWidth(state.colState, col),
              id = `${row}:${col}`,
              data = state.dataState[id],
              styles = toInlineStyles({
                  ...defaultStyles, 
                  ...state.stylesState[id]
                })
        return `
            <div 
                class="cell" 
                contenteditable
                data-col="${col}"
                data-id="${id}"
                data-type="cell"
                data-value="${data || ''}"
                style="${styles}; width: ${width}"
            >${parse(data) || ''}</div>
        `
    }
}

function toCol({col, index, width}) {
    return `
        <div 
            class="column" 
            data-type="resizable" 
            data-col="${index}" 
            style="width: ${width}">
            ${col}
            <div class="col-resize" data-resize="col"></div>
        </div>
    `
}

function createRow(content, iterator, state) {
    const resize = iterator ? `<div class="row-resize" data-resize="row"></div>` : '',
          height = getHeight(state, iterator)
    return `
        <div class="row" data-type="resizable" data-row="${iterator}" style="height: ${height}">
            <div class="row-info">
                ${iterator ? iterator : ''}
                ${resize}
            </div>
            <div class="row-data">${content}</div>
        </div>
    `
}

function toChar(_, index) {
    return String.fromCharCode(CODES.A + index)
}

function withWidthFrom(state) {
    return function(col, index) {
        return {
            col, index, width: getWidth(state.colState, index)
        }
    }
}

export function createTable(rowsCount = 20, state = {}) {
    const colsCount = CODES.Z - CODES.A + 1,
          rows = []
    const cols = new Array(colsCount)
        .fill('')
        .map(toChar)
        .map(withWidthFrom(state))
        .map(toCol)
        .join('')

    rows.push(createRow(cols, null, {}))
    for (let row = 0; row < rowsCount; row++) {
        const cells = new Array(colsCount)
            .fill('')
            .map(toCell(state, row))
            .join('')
        rows.push(createRow(cells, row+1, state.rowState))
    }

    return rows.join('')
}