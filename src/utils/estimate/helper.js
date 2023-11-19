export const equals = v => w => w[0] === v[0] && w[1] === v[1];
export const equalsSign = (board, ...s) => v => s.includes(board.get(v));
export const add = (x, y) => x + y;
export const getNeighbors = ([x, y]) => [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];