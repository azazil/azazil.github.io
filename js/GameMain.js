var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * GameMain extends ui.GameMainUI
 */
var GameMain = /** @class */ (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        var _this = _super.call(this) || this;
        _this.keySpaceDown = false;
        _this.preMouse = new Laya.Point();
        _this.init();
        return _this;
    }
    GameMain.prototype.init = function () {
        // this.ctrl_flash.on("mousedown", this.ctrl_flash, this.ctrlFlashDown)
        // this.ctrl_flash.on("mouseup", this.ctrl_flash, this.ctrlFlashUp)
        Laya.stage.on("mouseup", this, this.ctrlRockerUp);
        Laya.stage.on("mousedown", this, this.ctrlRockerDown);
        Laya.stage.on("mousemove", this, this.ctrlRockerMove);
        Laya.stage.on("keydown", this, this.keyDown);
        Laya.stage.on("keyup", this, this.keyUp);
    };
    GameMain.prototype.keyUp = function (e) {
        if (e.keyCode == 32) {
            this.ctrlFlashUp();
        }
    };
    GameMain.prototype.keyDown = function (e) {
        if (e.keyCode == 32) {
            this.ctrlFlashDown();
        }
    };
    GameMain.prototype.ctrlFlashDown = function () {
        game.snakeSelf.speedNow = "fast";
    };
    GameMain.prototype.ctrlFlashUp = function () {
        game.snakeSelf.speedNow = "normal";
    };
    //虚拟摇杆操作模式
    GameMain.prototype.ctrlRockerUp = function () {
        game.snakeSelf.speedNow = "stop";
        // this.ctrl_back.pos(-this.ctrl_back.width, this.ctrl_back.height)
        this.ctrl_rocker.visible = false;
        this.ctrl_rocker_move.visible = false;
    };
    GameMain.prototype.ctrlRockerDown = function () {
        game.snakeSelf.speedNow = "normal";
        this.ctrl_back.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    };
    GameMain.prototype.ctrlRockerMove = function () {
        this.ctrl_rocker.visible = false;
        this.ctrl_rocker_move.visible = true;
        if (distance(Laya.stage.mouseX, Laya.stage.mouseY, this.ctrl_back.x, this.ctrl_back.y) <= (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2)) {
            this.ctrl_rocker_move.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        }
        else {
            this.ctrl_rocker_move.pos(this.ctrl_back.x + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.cos(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x)), this.ctrl_back.y + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.sin(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x)));
        }
        game.snakeSelf.targetR = Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x) * 180 / Math.PI;
    };
    return GameMain;
}(ui.GameMainUI));
//# sourceMappingURL=GameMain.js.map