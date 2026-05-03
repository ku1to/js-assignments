'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    const sides = ['N', 'E', 'S', 'W'];
    const compassPoints = [];
    const directions = ['N', 'NbE', 'NNE', 'NEbN', 'NE', 'NEbE', 'ENE', 'EbN',
                        'E', 'EbS', 'ESE', 'SEbE', 'SE', 'SEbS', 'SSE', 'SbE',
                        'S', 'SbW', 'SSW', 'SWbS', 'SW', 'SWbW', 'WSW', 'WbS',
                        'W', 'WbN', 'WNW', 'NWbW', 'NW', 'NWbN', 'NNW', 'NbW'];

    for (let i = 0; i < 32; i++) {
        compassPoints.push({
            abbreviation: directions[i],
            azimuth: (i * 11.25) % 360
        });
    }
    return compassPoints;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    const results = [];

    function expand(input, depth = 0) {
        let openBraceIndex = -1;
        let closeBraceIndex = -1;
        let braceBalance = 0;

        for (let i = 0; i < input.length; i++) {
            if (input[i] === '{') {
                if (braceBalance === 0) {
                    openBraceIndex = i;
                }
                braceBalance++;
            } else if (input[i] === '}') {
                braceBalance--;
                if (braceBalance === 0 && openBraceIndex !== -1) {
                    closeBraceIndex = i;
                    break;
                }
            }
        }

        if (openBraceIndex === -1) {
            results.push(input);
            return;
        }

        if (closeBraceIndex === -1) {
            results.push(input);
            return;
        }

        const prefix = input.substring(0, openBraceIndex);
        const inner = input.substring(openBraceIndex + 1, closeBraceIndex);
        const suffix = input.substring(closeBraceIndex + 1);

        const parts = [];
        let currentPart = '';
        let partBraceBalance = 0;

        for (const char of inner) {
            if (char === '{') {
                partBraceBalance++;
                currentPart += char;
            } else if (char === '}') {
                partBraceBalance--;
                currentPart += char;
            } else if (char === ',' && partBraceBalance === 0) {
                parts.push(currentPart);
                currentPart = '';
            } else {
                currentPart += char;
            }
        }
        parts.push(currentPart);

        for (const part of parts) {
            expand(prefix + part + suffix, depth + 1);
        }
    }

    expand(str);

    for (const result of [...new Set(results)]) {
        yield result;
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    let row = 0, col = 0;
    let direction = 1; // 1 for up-right, -1 for down-left
    let current = 0;

    for (let i = 0; i < n * n; i++) {
        matrix[row][col] = current++;
        if (direction === 1) {
            if (col === n - 1) {
                row++;
                direction = -1;
            } else if (row === 0) {
                col++;
                direction = -1;
            } else {
                row--;
                col++;
            }
        } else {
            if (row === n - 1) {
                col++;
                direction = 1;
            } else if (col === 0) {
                row++;
                direction = 1;
            } else {
                row++;
                col--;
            }
        }
    }
    return matrix;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    if (dominoes.length === 0) return true;

    const canBuild = (remaining, lastNumber) => {
        if (remaining.length === 0) return true;

        for (let i = 0; i < remaining.length; i++) {
            const [a, b] = remaining[i];
            if (a === lastNumber) {
                const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
                if (canBuild(newRemaining, b)) return true;
            }
            if (b === lastNumber) {
                const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
                if (canBuild(newRemaining, a)) return true;
            }
        }
        return false;
    };

    for (let i = 0; i < dominoes.length; i++) {
        const [a, b] = dominoes[i];
        const remaining = [...dominoes.slice(0, i), ...dominoes.slice(i + 1)];
        if (canBuild(remaining, a) || canBuild(remaining, b)) {
            return true;
        }
    }

    return false;
}

/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    if (nums.length === 0) return '';
    const ranges = [];
    let start = nums[0];
    let prev = nums[0];

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === prev + 1) {
            prev = nums[i];
        } else {
            if (prev - start >= 2) {
                ranges.push(`${start}-${prev}`);
            } else {
                ranges.push(start.toString());
                if (prev !== start) {
                    ranges.push(prev.toString());
                }
            }
            start = nums[i];
            prev = nums[i];
        }
    }

    if (prev - start >= 2) {
        ranges.push(`${start}-${prev}`);
    } else {
        ranges.push(start.toString());
        if (prev !== start) {
            ranges.push(prev.toString());
        }
    }

    return ranges.join(',');
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
