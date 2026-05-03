'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    if (!searchStr) return true;
    const rows = puzzle.length;
    const cols = puzzle[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Вверх, вниз, влево, вправо

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (puzzle[i][j] === searchStr[0]) {
                const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
                if (dfs(i, j, 0, visited)) {
                    return true;
                }
            }
        }
    }
    return false;

    function dfs(i, j, index, visited) {
        if (index === searchStr.length) return true;
        if (i < 0 || i >= rows || j < 0 || j >= cols || visited[i][j] || puzzle[i][j] !== searchStr[index]) {
            return false;
        }
        visited[i][j] = true;
        for (const [di, dj] of directions) {
            if (dfs(i + di, j + dj, index + 1, visited)) {
                return true;
            }
        }
        visited[i][j] = false; // Отмена отметки для других путей
        return false;
    }
}

/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    if (chars.length === 0) yield '';
    else {
        for (let i = 0; i < chars.length; i++) {
            const currentChar = chars[i];
            const remainingChars = chars.slice(0, i) + chars.slice(i + 1);
            for (const perm of getPermutations(remainingChars)) {
                yield currentChar + perm;
            }
        }
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let maxProfit = 0;
    let currentMax = 0;

    // Идем с конца массива к началу
    for (let i = quotes.length - 1; i >= 0; i--) {
        if (quotes[i] > currentMax) {
        // Обновляем локальный пик, по которому будем продавать
        currentMax = quotes[i];
        } else {
        // Если цена ниже пика, "покупаем" сегодня и "продаем" по currentMax
        maxProfit += currentMax - quotes[i];
        }
    }

    return maxProfit;
}



/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                           "abcdefghijklmnopqrstuvwxyz" +
                           "0123456789-_.~";
    this.urlMap = new Map(); // Для хранения соответствий
    this.codeMap = new Map(); // Для обратного соответствия
}

UrlShortener.prototype = {
    encode: function(url) {
        // Если URL уже был сокращён, возвращаем существующий код
        if (this.urlMap.has(url)) {
            return this.urlMap.get(url);
        }

        // Генерируем уникальный код
        let code;
        do {
            // Используем хэш URL и берём первые 8 символов
            const hash = require('crypto')
                .createHash('sha256')
                .update(url)
                .digest('hex')
                .substring(0, 8);

            // Убираем символы, не входящие в urlAllowedChars
            code = hash.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~]/g, '');
        } while (this.codeMap.has(code)); // Проверяем уникальность

        // Сохраняем соответствие
        this.urlMap.set(url, code);
        this.codeMap.set(code, url);

        return code;
    },

    decode: function(code) {
        return this.codeMap.get(code) || null;
    }
};


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
