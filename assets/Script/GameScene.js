import MainArea  from "./MainArea";
import EndContainer from "./EndContainer";

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        mainArea: {
            default: null,
            type: MainArea,
        },
        whiteScore: {
            default: null,
            type: cc.Label,
        },
        blackScore: {
            default: null,
            type: cc.Label,
        },
        endModal: {
            default: null,
            type: EndContainer,
        },
        
    },

    //use this for initialization
    onLoad: function () {
        GameScene = this;
        this.endModal.node.active = false;
    },

    // start game
    start: function () {
        this.endModal.node.active = false;
        // this.playHistory._step = -1;
        // this.playHistory._temp = -1;
        // this._currentUser = 0;
    },

    // draw mainboard
    drawBoard: function (board, turn) {
        this.mainArea.draw(board, turn);
    },

    // Set Score
    setScore: function ( blackScoreNum, whiteScoreNum ) {
        this.blackScore.string = blackScoreNum;
        this.whiteScore.string = whiteScoreNum;
    },

      // show end modal
      showEndModal: function (blackScore, whiteScore) {
        this.endModal.setText(blackScore, whiteScore);
        this.endModal.node.active = true;
    },

});