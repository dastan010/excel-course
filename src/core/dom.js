class Dom {
    constructor(selector) {
        this.$el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector
    }

    html(html) {
        if (typeof html === 'string' ) {
            this.$el.innerHTML = html
            return this
        }
        return this.$el.outerHTML
    }

    clear() {
        this.html('')
        return this
    }

    append(node) {
        node instanceof Dom
            ? node = node.$el
            : ''
        Element.prototype.append
            ? this.$el.append(node)
            : this.$el.appendChild(node)
        return this
    }

    on(eventType, callback) {
        this.$el.addEventListener(eventType, callback)
    }
}


export function $(selector) {
    return new Dom(selector)
}

$.create = (tagName, classes = '') => {
    const el = document.createElement(tagName)
    if (classes) {
        el.classList.add(classes)
    }
    return $(el)
}