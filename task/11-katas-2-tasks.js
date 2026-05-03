'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */

function parseBankAccount(bankAccount) {
    // Разбиваем строку на массивы строк для каждой цифры
    const lines = bankAccount.split('\n');

    // Шаблоны для каждой цифры (0-9)
    const digitPatterns = [
        // 0
        { top: ' _ ', middle: '| |', bottom: '|_|' },
        // 1
        { top: '   ', middle: '  |', bottom: '  |' },
        // 2
        { top: ' _ ', middle: ' _|', bottom: '|_ ' },
        // 3
        { top: ' _ ', middle: ' _|', bottom: ' _|' },
        // 4
        { top: '   ', middle: '|_|', bottom: '  |' },
        // 5
        { top: ' _ ', middle: '|_ ', bottom: ' _|' },
        // 6
        { top: ' _ ', middle: '|_ ', bottom: '|_|' },
        // 7
        { top: ' _ ', middle: '  |', bottom: '  |' },
        // 8
        { top: ' _ ', middle: '|_|', bottom: '|_|' },
        // 9
        { top: ' _ ', middle: '|_|', bottom: ' _|' }
    ];

    // Извлекаем строки для каждой цифры
    const topLine = lines[0];
    const middleLine = lines[1];
    const bottomLine = lines[2];

    let accountNumber = '';

    // Проходим по каждому символу (каждая цифра занимает 3 символа в ширину)
    for (let i = 0; i < topLine.length; i += 3) {
        const top = topLine.slice(i, i + 3);
        const middle = middleLine.slice(i, i + 3);
        const bottom = bottomLine.slice(i, i + 3);

        // Ищем совпадение с шаблонами цифр
        for (let digit = 0; digit < digitPatterns.length; digit++) {
            const pattern = digitPatterns[digit];
            if (pattern.top === top && pattern.middle === middle && pattern.bottom === bottom) {
                accountNumber += digit.toString();
                break;
            }
        }
    }

    return parseInt(accountNumber, 10);
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    const words = text.split(' ');
    let currentLine = [];
    let currentLength = 0;

    for (const word of words) {
        const wordLength = word.length;
        const newLength = currentLength + (currentLine.length > 0 ? 1 : 0) + wordLength;

        if (newLength <= columns) {
            currentLine.push(word);
            currentLength = newLength;
        } else {
            if (currentLine.length > 0) {
                yield currentLine.join(' ');
                currentLine = [word];
                currentLength = wordLength;
            } else {
                yield word;
                currentLine = [];
                currentLength = 0;
            }
        }
    }

    if (currentLine.length > 0) {
        yield currentLine.join(' ');
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    // Извлекаем значения и масти карт
    const values = hand.map(card => {
        const value = card.slice(0, -1);
        return value === 'A' ? 14 :
               value === 'K' ? 13 :
               value === 'Q' ? 12 :
               value === 'J' ? 11 :
               parseInt(value, 10);
    }).sort((a, b) => a - b);

    const suits = hand.map(card => card.slice(-1));

    // Проверяем, все ли карты одной масти (Флеш)
    const isFlush = new Set(suits).size === 1;

    // Проверяем, есть ли стрит (последовательность из 5 карт)
    const isStraight = (() => {
        // Проверяем обычный стрит
        if (values[4] - values[0] === 4) return true;
        // Проверяем стрит с тузом как 1 (A, 2, 3, 4, 5)
        if (values.includes(14) && values[0] === 2 && values[1] === 3 && values[2] === 4 && values[3] === 5) {
            return true;
        }
        return false;
    })();

    // Проверяем Straight Flush
    if (isFlush && isStraight) {
        return PokerRank.StraightFlush;
    }

    // Считаем частоту значений карт
    const valueCounts = {};
    values.forEach(value => {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    const counts = Object.values(valueCounts).sort((a, b) => b - a);

    // Проверяем Four of a Kind
    if (counts[0] === 4) {
        return PokerRank.FourOfKind;
    }

    // Проверяем Full House
    if (counts[0] === 3 && counts[1] === 2) {
        return PokerRank.FullHouse;
    }

    // Проверяем Flush
    if (isFlush) {
        return PokerRank.Flush;
    }

    // Проверяем Straight
    if (isStraight) {
        return PokerRank.Straight;
    }

    // Проверяем Three of a Kind
    if (counts[0] === 3) {
        return PokerRank.ThreeOfKind;
    }

    // Проверяем Two Pairs
    if (counts[0] === 2 && counts[1] === 2) {
        return PokerRank.TwoPairs;
    }

    // Проверяем One Pair
    if (counts[0] === 2) {
        return PokerRank.OnePair;
    }

    // Если ничего не подошло, то High Card
    return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
  
    const lines = figure.split("\n");
    const height = lines.length;
    const width = lines[0].length;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (lines[y][x] === "+") {
            for (let bottomY = y + 1; bottomY < height; bottomY++) {
                if (lines[bottomY][x] === "+") {
                for (let rightX = x + 1; rightX < width; rightX++) {
                    if (lines[y][rightX] === "+") {
                    if (lines[bottomY][rightX] === "+") {
                        if (isRectangle(lines, x, y, rightX, bottomY)) {
                        yield drawRectangle(rightX - x + 1, bottomY - y + 1);
                        rightX = width;
                        bottomY = height;
                        }
                    }
                    }
                }
                }
            }
            }
        }
    }
}

function isRectangle(lines, startX, startY, endX, endY) {
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            if (y === startY || y === endY) {
            if ((x === startX || x === endX) && lines[y][x] !== "+") {
                return false;
            }
            } else {
            if (lines[y][x] === "+") {
                return false;
            }
            if ((x === startX || x === endX) && lines[y][x] !== "|") {
                return false;
            }
            }
        }
    }
    return true;
}

function drawRectangle(width, height) {
    let rectangle = "+" + "-".repeat(width - 2) + "+\n";
    for (let y = 1; y < height - 1; y++) {
        rectangle += "|" + " ".repeat(width - 2) + "|\n";
    }
    rectangle += "+" + "-".repeat(width - 2) + "+\n";
    return rectangle;
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
