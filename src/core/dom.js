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

    text(text) {
        if (typeof text === 'string') {
            this.$el.textContent = text
        }

        if (this.$el.tagName.toLowerCase() === 'input') {
            return this.$el.value.trim()
        }
        return this.$el.textContent.trim()
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

    off(eventType, callback) {
        this.$el.removeEventListener(eventType, callback)
    }

    closest(selector) {
        return $(this.$el.closest(selector))
    }

    getCoords() {
        return this.$el.getBoundingClientRect()
    }

    get data() {
        return this.$el.dataset
    }

    find(selector) {
        return $(this.$el.querySelector(selector))
    }

    findAll(selector) {
        return this.$el.querySelectorAll(selector)
    }

    css(styles = {}) {
        Object.keys(styles).forEach(key => {
            this.$el.style[key] = styles[key]
        })
    }

    addClass(className) {
        this.$el.classList.add(className)
    }
    
    removeClass(className) {
        this.$el.classList.remove(className)
    }

    id(parse) {
       if (parse) {
           const parsed = this.id().split(':')
           return {
               col: +parsed[1],
               row: +parsed[0]
           }
       }
       return this.data.id 
    }

    focus() {
        this.$el.focus()
        return this
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
