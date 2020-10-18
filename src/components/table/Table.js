import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template'
import {resizeHandler} from '@/components/table/table.resize'
import {shouldResize} from '@/components/table/table.functions'
import {TableSelection} from './TableSelection'
import {isCell, matrix, nextSelector} from './table.functions'
import {$} from '@core/dom'

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            listeners: ['mousedown', 'keydown', 'input'],
            ...options
        })
    }
    
    toHTML() {
        return createTable(40)
    }

    prepare() {
        this.selection = new TableSelection()
    }

    init() {
        super.init()
        const $cell = this.$root.find('[data-id="0:0"]')
        this.selection.select($cell)
        this.$on('formula:done', () => {
            this.selection.current.focus()
        })
        this.$on('formula:input', text => {
            this.selection.current.text(text)
        })
    }

    onMousedown(event) {
        if (shouldResize(event)) {
            resizeHandler(this.$root, event)
        } else if (isCell(event)) {
            const $target = $(event.target)
            if (event.shiftKey) {
                const $cells = matrix($target, this.selection.current).map(id => this.$root.find(`[data-id="${id}"]`))
                this.selection.selectGroup($cells)
            } else {
                this.selection.select($target)
            }
        }
    }

    onKeydown(event) {
        const keys = [
            'Enter',
            'Tab',
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight'
        ]

        const {key} = event
        if (keys.includes(key) && !event.shiftKey) {
            event.preventDefault()
            const id = this.selection.current.id(true),
                  $next = this.$root.find(nextSelector(key, id))
            this.selection.select($next)      
            this.$emit('table:select', $next)
        }
    }

    onInput(event) {
        this.$emit('table:input', $(event.target))
    }
}


