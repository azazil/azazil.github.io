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
 * Ammo extends laya.display.Sprite
 */
var Ammo = /** @class */ (function (_super) {
    __extends(Ammo, _super);
    function Ammo(x, y, type, moveType, speed, rotation, allyType, style) {
        if (x === void 0) { x = game.gameMainUI.map.width / 2; }
        if (y === void 0) { y = game.gameMainUI.map.height / 2; }
        var _this = _super.call(this) || this;
        _this.type = 1; // 弹药类型  1 单发 
        _this.moveType = 1; //1 直线前进
        _this.speed = 0; // 弹药速度 
        _this.range = 500; //弹药射程
        _this.allyType = 1; // 阵营，根据发射主体改变
        _this.ammoSize = 1; //体型缩放比例
        _this.style = "ammo1"; //样式
        _this.action = "fly"; //动作
        _this.pos(x, y);
        _this.speed = speed;
        _this.rotation = rotation;
        _this.ammoAni = new Laya.Animation();
        _this.ammoAni.loadAnimation("GameAmmo.ani");
        _this.addChild(_this.ammoAni);
        // this.ammoAni.play(0, true, this.style + "_" + this.action);
        _this.playAction(_this.action);
        return _this;
    }
    Ammo.prototype.playAction = function (action) {
        this.action = action;
        this.ammoAni.play(0, true, this.style + "_" + action);
    };
    /**角色死亡并回收到对象池**/
    Ammo.prototype.die = function () {
        //角色动画停止
        this.ammoAni.stop();
        //去除所有动画监听
        this.ammoAni.offAll();
        //从舞台移除
        this.removeSelf();
        //回收到对象池
        Laya.Pool.recover("ammo", this);
    };
    return Ammo;
}(laya.display.Sprite));
//# sourceMappingURL=Ammo.js.map