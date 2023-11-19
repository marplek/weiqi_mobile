import Record from './Record';
import Weiqi from './Weiqi';

class SGFConverter {
  static propertiesMapping = {
    gameName: 'GN',
    date: 'DT',
    blackPlayer: 'PB',
    blackRank: 'BR',
    whitePlayer: 'PW',
    whiteRank: 'WR',
    komi: 'KM',
    handicap: 'HA',
    result: 'RE',
  };

  static toSGF(record) {
    const metaData = record.metaData;

    let sgf = '(;GM[1]FF[4]CA[UTF-8]SZ[19]';

    for (const [key, propName] of Object.entries(this.propertiesMapping)) {
      if (metaData[key] !== '') {
        sgf += `${propName}[${metaData[key]}]`;
      }
    }

    let node = record.root;
    while (node.children.length > 0) {
      node = node.children[0];
      sgf += this.nodeToSGF(node);
    }
    sgf += ')';
    return sgf;
  }

  static nodeToSGF(node) {
    const letters = 'abcdefghjklmnopqrst';
    let sgf = '';
    const col = letters[node.position.col];
    const row = letters[node.position.row];
    sgf += ';' + (node.player === 1 ? 'B' : 'W') + '[' + col + row + ']';
    if (node.comment) {
      sgf += 'C[' + node.comment + ']';
    }
    for (let r = 0; r < node.markers.length; r++) {
      for (let c = 0; c < node.markers[r].length; c++) {
        const marker = node.markers[r][c];
        if (marker !== 0) {
          const sgfRow = letters[r];
          const sgfCol = letters[c];
          const position = `${sgfCol}${sgfRow}`;
          if (marker === 'cir') {
            sgf += `CR[${position}]`;
          } else if (marker === 'tri') {
            sgf += `TR[${position}]`;
          } else if (marker === 'rec') {
            sgf += `SQ[${position}]`;
          } else if (marker === 'clo') {
            sgf += `MA[${position}]`;
          } else if (/[A-Z]/.test(marker)) {
            sgf += `[${position}:${marker}]`;
          }
        }
      }
    }
    // 如果有其他分支
    if (node.children.length > 1) {
      for (const child of node.children.slice(1)) {
        sgf += '(' + this.nodeToSGF(child);
      }
    }
    // 如果有子節點
    if (node.children.length === 0) {
      sgf += ';';
    }
    return sgf;
  }

  static toRecord(sgf) {
    const boardSizeMatch = sgf.match(/SZ\[(\d+)\]/);
    const boardSize = parseInt(boardSizeMatch[1]);
    const weiqi = new Weiqi(boardSize);
    const record = new Record(weiqi.getBoard());

    // 解析元數據
    const metaData = {};
    for (const [key, propName] of Object.entries(this.propertiesMapping)) {
      const regex = new RegExp(`${propName}\\[(.*?)\\]`);
      const match = sgf.match(regex);
      metaData[key] = match ? match[1] : '';
    }
    record.setMetaData(metaData);

    const regex =
      /\bB\[(\w{2})\]|\bW\[(\w{2})\]|C\[(.*?)\]|CR\[(\w{2})\]|TR\[(\w{2})\]|SQ\[(\w{2})\]|MA\[(\w{2})\]|\[(\w{2}):([A-Z])\]/g;
    let match;
    let comment = '';
    let markers = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(0));

    while ((match = regex.exec(sgf))) {
      if (match[1] || match[2]) {
        const player = match[1] ? 1 : -1;
        const move = match[1] || match[2];
        const col = 'abcdefghjklmnopqrst'.indexOf(move[0]);
        const row = 'abcdefghjklmnopqrst'.indexOf(move[1]);

        weiqi.setBoard(record.currentNode.board);
        weiqi.setCurrentPlayer(player);
        if (weiqi.placeStone(row, col)) {
          record.addMove(
            weiqi.getBoard(),
            { row, col },
            player,
            comment,
            markers
          );
          comment = ''; // 清空評論
          markers = Array(boardSize)
            .fill(null)
            .map(() => Array(boardSize).fill(0));
        }
      } else if (match[3]) {
        // 解析評論
        comment = match[3];
      } else if (match[4]) {
        // 解析圆形标记
        const col = 'abcdefghjklmnopqrst'.indexOf(match[4][0]);
        const row = 'abcdefghjklmnopqrst'.indexOf(match[4][1]);
        record.setMarkers({ row, col }, 'cir');
      } else if (match[5]) {
        // 解析三角形标记
        const col = 'abcdefghjklmnopqrst'.indexOf(match[5][0]);
        const row = 'abcdefghjklmnopqrst'.indexOf(match[5][1]);
        record.setMarkers({ row, col }, 'tri');
      } else if (match[6]) {
        // 解析正方形标记
        const col = 'abcdefghjklmnopqrst'.indexOf(match[6][0]);
        const row = 'abcdefghjklmnopqrst'.indexOf(match[6][1]);
        record.setMarkers({ row, col }, 'rec');
      } else if (match[7]) {
        // 解析叉叉标记
        const col = 'abcdefghjklmnopqrst'.indexOf(match[7][0]);
        const row = 'abcdefghjklmnopqrst'.indexOf(match[7][1]);
        record.setMarkers({ row, col }, 'clo');
      } else if (match[8] && match[9]) {
        // 解析标签（label）
        const col = 'abcdefghjklmnopqrst'.indexOf(match[8][0]);
        const row = 'abcdefghjklmnopqrst'.indexOf(match[8][1]);
        const label = match[9];
        record.setMarkers({ row, col }, 'letter', label);
      }
    }

    return record;
  }
}

export default SGFConverter;
