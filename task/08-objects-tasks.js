'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype.getArea = function() {
    return this.width * this.height;
};

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    const obj = JSON.parse(json);
    Object.setPrototypeOf(obj, proto);
    return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
    constructor() {
        this.parts = [];
        this.str = '';
        this._combined = null;
    }

    _add(type, symbol, value) {
        if (this._combined) {
            throw new Error('Cannot extend combined selector');
        }

        // 1. Проверка уникальности
        const uniques = ['element', 'id', 'pseudoElement'];
        if (uniques.includes(type) && this.parts.includes(type)) {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }

        // 2. Проверка порядка
        const order = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
        const typeIndex = order.indexOf(type);
        const lastTypeIndex = this.parts.length > 0 
            ? order.indexOf(this.parts[this.parts.length - 1]) 
            : -1;

        if (typeIndex < lastTypeIndex) {
            throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }

        this.parts.push(type);
        this.str += `${symbol}${value}`;
        return this;
    }

    element(v) { return this._add('element', '', v); }
    id(v) { return this._add('id', '#', v); }
    class(v) { return this._add('class', '.', v); }
    attr(v) { return this._add('attr', '[', `${v}]`); }
    pseudoClass(v) { return this._add('pseudoClass', ':', v); }
    pseudoElement(v) { return this._add('pseudoElement', '::', v); }

    stringify() {
        return this._combined || this.str;
    }
}

const cssSelectorBuilder = {
    element(v) { return new Selector().element(v); },
    id(v) { return new Selector().id(v); },
    class(v) { return new Selector().class(v); },
    attr(v) { return new Selector().attr(v); },
    pseudoClass(v) { return new Selector().pseudoClass(v); },
    pseudoElement(v) { return new Selector().pseudoElement(v); },

    combine(s1, combinator, s2) {
        const res = new Selector();
        // В тестах для пустого комбинатора (' ') ожидается 3 пробела
        const sep = combinator === ' ' ? '   ' : ` ${combinator} `;
        res._combined = `${s1.stringify()}${sep}${s2.stringify()}`;
        return res;
    }
};

module.exports = {
    cssSelectorBuilder,
    Rectangle: class {
        constructor(w, h) {
            this.width = w;
            this.height = h;
        }
        getArea() {
            return this.width * this.height;
        }
    },
    getJSON: (obj) => JSON.stringify(obj),
    fromJSON: (proto, json) => {
        const obj = JSON.parse(json);
        Object.setPrototypeOf(obj, proto);
        return obj;
    }
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
