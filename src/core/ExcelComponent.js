import {DomListener} from '@core/DomListener'

export class ExcelComponent extends DomListener {
    constructor($root, options = {}) {
        super($root, options.listeners)
        this.name = options.name || ''
        this.emitter = options.emitter
        this.store = options.store
        this.subscribe = options.subscribe || []
        this.unsubscribers = []
        this.prepare()
    }

    // Настраиваем наш компонент до init()
    prepare() {}

    // Уведомляем слушателей про события event
    $emit(event, ...args) {
        this.emitter.emit(event, ...args)
    }

    storeChanged() {}

    isWatching(key) {
        return this.subscribe.includes(key) 
    }

    // Подписываемся на событие event
    $on(event, fn) {
        const unsub = this.emitter.subscribe(event, fn)
        this.unsubscribers.push(unsub)
    }

    $dispatch(action) {
        this.store.dispatch(action)
    }

    // Возвращаем шаблон компонента
    toHTML() {
        return ''
    }
    // Инициализируем компонент
    // Добавляем слушателей
    init() {
        this.initDOMListeners()
    }

    // Удаляем компонент
    // Чистим слушатели
    destroy() {
        this.removeDOMListeners()
        this.unsubscribers.forEach(unsub => unsub())
    }
}