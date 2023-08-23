import { ClientCommService } from "./Common/CommServices";
import { BLOCKSIZE } from "./Common/Constants";

cc.Class({
    extends: cc.Component,

    properties: {
        blackStonePrefab: cc.Prefab,
        whiteStonePrefab: cc.Prefab,
        availPrefab: cc.Prefab,
        redPointPrefab: cc.Prefab,
        

        _whiteStone: [],
        _blackStone: [],
        _x: 0,
        _y: 0,
        _click: false,
        _board: new Array(),
        _turn: 0,
        _res: false,
    },

    onLoad() {
        this._turn = 0;
        this._res = false;
        // Board initialization
        for (let i = 0; i < 8; i++) {
            this._board[i] = new Array();
            for (let j = 0; j < 8; j++) {
                this._board[i][j] = 0;
            }
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    turnStone(board, x, y, i, j, mode, turn) {
        if (i == 0 && j == 0) { return 0; }

        x += i;
        y += j;

        // Exception handling
        if (x < 0 || x > 7 || y < 0 || y > 7) { return 0; }

        // when nothing
        if (board[x][y] == 0) {
            return 0;

            // when you have your own stone
        } else if (board[x][y] == turn) {
            return 3;

            // When there is an opponent's stone
        } else {
            // Finally, if you have your own stone, turn it over.
            if (this.turnStone(board, x, y, i, j, mode, turn) >= 2) {
                if (mode != 0) { board[x][y] = turn; }
                return 2;
            }

            return 1;
        }
    },

    // board draw
    draw(board, turn) {
        this._turn = turn;
        this._res = true;
        this.node.removeAllChildren();
        for(let x = 0; x < 8; x++) {
            for(let y = 0; y < 8; y++) {
                let position = cc.v2(x*50 + 25, -(y*50 + 25));

                // where the stone is
                if (board[x][y] == 1 || board[x][y] == -1) {
                    if (board[x][y] == 1) {
                       const black = cc.instantiate(this.blackStonePrefab);
                       this.node.addChild(black);
                       black.setPosition(position);
                    }else if (board[x][y] == -1) {
                        const white = cc.instantiate(this.whiteStonePrefab);
                        this.node.addChild(white);
                        white.setPosition(position);
                    }

                    // A place without stones (check if it can be placed)
                }

                else if (board[x][y] == 0) {
                    var turnCheck = 0;
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            if (this.turnStone(board, x, y, i, j, 0, turn) == 2) {
                                // console.log(x, y);
                                const avail = cc.instantiate(this.availPrefab);
                                this.node.addChild(avail);
                                avail.setPosition(position);
                                turnCheck = 1;
                                break;
                            }
                        }
                        if (turnCheck != 0) { break; }
                    }
                }
            }
        }

        // When click, the stone that get the red point in its center is appeared
        this._res = true;
        if (this._click) {
            const RedPoint = cc.instantiate(this.redPointPrefab);
            this.node.addChild(RedPoint);
            let position = cc.v2(this._x * 50 + 25, -(this._y * 50 + 25));
            RedPoint.setPosition(position);
            this._click = false;
        }
    },

    onTouchStart(event) {
        if (this._res) {
            // Get the position of the click event
            let touchPos = event.getLocation();
            touchPos = this.node.convertToNodeSpaceAR(touchPos);
            this._x = Math.floor(touchPos.x / BLOCKSIZE);
            this._y = Math.floor(Math.abs(touchPos.y / BLOCKSIZE));
            ClientCommService.sendClickPosition(this._x, this._y, this._turn);
            this._res = false;
            this._click = true;
        }
    },

})