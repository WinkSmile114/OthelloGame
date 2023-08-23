import { ClientCommService } from "./ClientCommService";

cc.Class({
    extends: cc.Component,

    properties: {
        ModalText: {
            default: null,
            type: cc.Label,
        },
        ModalButton: {
            default: null,
            type: cc.Button,
        }
    },
    onLoad() {

    },

    setText(blackScore, whiteScore) {
        if(blackScore > whiteScore) {
            this.ModalText.string = "Black Win!"
        }else if (blackScore < whiteScore) {
            this.ModalText.string = "White Win!"
        }else {
            this.ModalText.string = "Same!"
        }
    },

    onClick() {
        ClientCommService.sendRestart();
        this.node.active = false;
    }
})