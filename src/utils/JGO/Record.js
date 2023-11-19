class TreeNode {
  constructor(
    board,
    position,
    player,
    moveIndex,
    parent = null,
    comment = '',
    markers = '',
    size = 19
  ) {
    this.board = board;
    this.position = position;
    this.player = player;
    this.moveIndex = moveIndex;
    this.parent = parent;
    this.children = [];
    this.branchChildren = [];
    this.comment = comment;
    this.markers =
      markers ||
      Array(size)
        .fill(null)
        .map(() => Array(size).fill(0));
  }
}

class Record {
  constructor(initialBoard, size = 19) {
    this.root = new TreeNode(initialBoard, null, null, 0, null, '', '', size);
    this.boardSize = size;
    this.currentNode = this.root;
    this.lastIndex = 0;
    this.metaData = {
      gameName: '',
      date: '',
      blackPlayer: '',
      blackRank: '',
      whitePlayer: '',
      whiteRank: '',
      komi: '6.5',
      handicap: '',
      result: '',
      notes: '',
    };
  }

  setMetaData(metaData) {
    this.metaData = metaData;
  }

  getMetaData() {
    return this.metaData;
  }

  setComment(comment) {
    this.currentNode.comment = comment;
  }

  getComment() {
    return this.currentNode.comment;
  }

  setMarkers(position, markerType, letter = null) {
    if (
      position['row'] >= 0 &&
      position['row'] < this.boardSize &&
      position['col'] >= 0 &&
      position['col'] < this.boardSize &&
      this.currentNode.markers[position['row']][position['col']] == 0
    ) {
      if (markerType === 'letter' && letter) {
        this.currentNode.markers[position['row']][position['col']] = letter;
      } else {
        this.currentNode.markers[position['row']][position['col']] = markerType;
      }
    }
  }

  deleteMarkers(position) {
    if (
      position['row'] >= 0 &&
      position['row'] < this.boardSize &&
      position['col'] >= 0 &&
      position['col'] < this.boardSize &&
      this.currentNode.markers[position['row']][position['col']] !== 0
    ) {
      this.currentNode.markers[position['row']][position['col']] = 0;
    }
  }

  getMarkers() {
    return this.currentNode.markers;
  }

  getBoard() {
    return this.currentNode.board;
  }

  addMove(board, position, player) {
    const newIndex = this.lastIndex + 1;
    const newNode = new TreeNode(
      board,
      position,
      player,
      newIndex,
      this.currentNode
    );
    this.currentNode.children.push(newNode);
    this.currentNode = newNode;
    this.lastIndex = newIndex;
  }

  addBranch(board, position, player) {
    const newIndex = this.lastIndex + 1;
    const newNode = new TreeNode(
      board,
      position,
      player,
      newIndex,
      this.currentNode
    );
    this.currentNode.branchChildren.push(newNode);
    // 可以選擇是否在添加分支時切換到分支
    this.currentNode = newNode;
  }
  
  switchToBranch(branchIndex) {
    if (
      this.currentNode.branchChildren &&
      this.currentNode.branchChildren[branchIndex]
    ) {
      this.currentNode = this.currentNode.branchChildren[branchIndex];
      return {
        board: this.currentNode.board,
        position: this.currentNode.position,
        player: this.currentNode.player,
        moveIndex: this.currentNode.moveIndex,
      };
    } else {
      return null; // 分支不存在
    }
  }

  // 添加一個方法用於切換回主線
  switchToMainLine() {
    if (this.currentNode.parent) {
      this.currentNode = this.currentNode.parent.children[0];
      return {
        board: this.currentNode.board,
        position: this.currentNode.position,
        player: this.currentNode.player,
        moveIndex: this.currentNode.moveIndex,
      };
    } else {
      return null; // 無法切換回主線，已經在根節點
    }
  }

  getLastNode() {
    let currentNode = this.root;
    while (currentNode.children.length > 0) {
      currentNode = currentNode.children[0];
    }
    return currentNode;
  }

  moveForward() {
    if (this.currentNode.children.length > 0) {
      // Move to the first child by default
      this.currentNode = this.currentNode.children[0];
      return {
        board: this.currentNode.board,
        position: this.currentNode.position,
        player: this.currentNode.player,
        moveIndex: this.currentNode.moveIndex,
      };
    } else {
      return null; // Cannot move forward, no child nodes
    }
  }

  moveBackward() {
    if (this.currentNode.parent) {
      this.currentNode = this.currentNode.parent;
      return {
        board: this.currentNode.board,
        position: this.currentNode.position,
        player: this.currentNode.player,
        moveIndex: this.currentNode.moveIndex,
      };
    } else {
      return null; // Cannot move backward, already at the root node
    }
  }

  moveToStart() {
    this.currentNode = this.root;
    return {
      board: this.currentNode.board,
      position: this.currentNode.position,
      player: this.currentNode.player,
      moveIndex: this.currentNode.moveIndex,
    };
  }

  moveToEnd() {
    while (this.currentNode.children.length > 0) {
      this.currentNode = this.currentNode.children[0];
    }
    return {
      board: this.currentNode.board,
      position: this.currentNode.position,
      player: this.currentNode.player,
      moveIndex: this.currentNode.moveIndex,
    };
  }

  moveToIndex(index) {
    let currentNode = this.root;
    while (currentNode.moveIndex !== index && currentNode.children.length > 0) {
      currentNode = currentNode.children[0];
    }
    if (currentNode.moveIndex === index) {
      this.currentNode = currentNode;
      return {
        board: this.currentNode.board,
        position: this.currentNode.position,
        player: this.currentNode.player,
        moveIndex: this.currentNode.moveIndex,
      };
    } else {
      return null; // Index not found in the record
    }
  }

  moveForwardBy(steps) {
    let result = null;
    for (let i = 0; i < steps; i++) {
      const tempResult = this.moveForward();
      if (!tempResult) {
        break;
      }
      result = tempResult;
    }
    return result;
  }

  moveBackwardBy(steps) {
    let result = null;
    for (let i = 0; i < steps; i++) {
      const tempResult = this.moveBackward();
      if (!tempResult) {
        break;
      }
      result = tempResult;
    }
    return result;
  }

  removeCurrentMove() {
    console.log(Boolean(this.currentNode.parent));
    console.log(this.currentNode);
    if (this.currentNode.parent) {
      const parent = this.currentNode.parent;
      const index = parent.children.indexOf(this.currentNode);
      parent.children.splice(index, 1);
      this.currentNode = parent;
      this.lastIndex = this.currentNode.moveIndex; // Update lastIndex
      return {
        board: this.currentNode.board,
        position: this.currentNode.position,
        player: this.currentNode.player,
        moveIndex: this.currentNode.moveIndex,
      };
    } else {
      this.currentNode.children = [];
      this.lastIndex = this.currentNode.moveIndex; // Update lastIndex
      return null; // Cannot remove root node
    }
  }
}
export default Record;
