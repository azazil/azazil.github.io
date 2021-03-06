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
 * Snake extends laya.display.Sprite
 */
var Role = /** @class */ (function (_super) {
    __extends(Role, _super);
    function Role(x, y, hitRadius, roleSize, targetR) {
        if (x === void 0) { x = game.gameMainUI.map.width / 2; }
        if (y === void 0) { y = game.gameMainUI.map.height / 2; }
        if (roleSize === void 0) { roleSize = 1; }
        if (targetR === void 0) { targetR = 0; }
        var _this = _super.call(this) || this;
        _this.campType = 1; // 阵营类型  1己方,2敌人
        _this.bodyType = 1; // 身体类型   1单体 ,2蛇形
        _this.style = "npc1"; //样式
        _this.action = "move"; //动作
        _this.speedObj = { "slow": 2, "normal": 4, "fast": 6, "stop": 0, "rotation": 360 };
        _this.speedNow = "slow";
        _this.hitRadius = 40; //碰撞检测半径
        _this.rotateType = 2; // 动画转向方式，默认1为随移动方向，2左右转向，3为不转向
        _this.rotateSpeed = _this.speedObj['rotation']; //0为不转向，360为瞬间转向
        _this.kill = 0; //击杀数量
        _this.hp = 10; //生命值
        _this.shootInterval = 300; //射击间隔时间。改为射速？
        _this.shootTime = 300; //上次射击时间
        _this.AI = false;
        _this.pos(x, y);
        _this.roleSize = roleSize;
        _this.hitRadius = hitRadius;
        _this.speed = _this.speedObj[_this.speedNow];
        _this.rotation = _this.rotationMove = _this.targetR = targetR;
        _this.roleAni = new Laya.Animation();
        _this.roleAni.loadAnimation("GameRole.ani");
        _this.addChild(_this.roleAni);
        // this.roleAni.play(0, true, this.style + "_" + this.action);
        _this.playAction(_this.action);
        _this.roleAni.scale(_this.roleSize, _this.roleSize);
        return _this;
    }
    Role.prototype.playAction = function (action) {
        this.action = action;
        this.roleAni.play(0, true, this.style + "_" + action);
    };
    Role.prototype.move = function () {
        this.rotationChange();
        var xb, yb;
        xb = this.speed * Math.cos(this.rotationMove * Math.PI / 180);
        yb = this.speed * Math.sin(this.rotationMove * Math.PI / 180);
        var pos = { x: this.x, y: this.y };
        var posBefore = { x: this.x, y: this.y };
        if (!(this.x + xb >= game.gameMainUI.map.width - this.width / 2 || this.x + xb <= this.width / 2)) {
            this.x += xb;
            pos.x = this.x;
        }
        else {
            this.moveOut();
        }
        if (!(this.y + yb >= game.gameMainUI.map.height - this.width / 2 || this.y + yb <= this.width / 2)) {
            this.y += yb;
            pos.y = this.y;
        }
        else {
            this.moveOut();
        }
    };
    Role.prototype.moveOut = function () {
        //碰到边界了
    };
    Role.prototype.rotationChange = function () {
        var perRotation = Math.abs(this.targetR - this.rotationMove) < this.speedObj['rotation'] ? Math.abs(this.targetR - this.rotationMove) : this.speedObj['rotation'];
        if (this.targetR < -0 && this.rotationMove > 0 && Math.abs(this.targetR) + this.rotationMove > 180) {
            perRotation = (180 - this.rotationMove) + (180 + this.targetR) < this.speedObj['rotation'] ? (180 - this.rotationMove) + (180 + this.targetR) : this.speedObj['rotation'];
            this.rotationMove += perRotation;
        }
        else {
            this.rotationMove += this.targetR > this.rotationMove && Math.abs(this.targetR - this.rotationMove) <= 180 ? perRotation : -perRotation;
        }
        this.rotationMove = Math.abs(this.rotationMove) > 180 ? (this.rotationMove > 0 ? this.rotationMove - 360 : this.rotationMove + 360) : this.rotationMove;
        switch (this.rotateType) {
            case 1:
                this.rotation = this.rotationMove;
                break;
            case 2:
                this.rotation = 0;
                if (this.rotationMove > 90 && this.rotationMove <= 270) {
                    if (this.roleAni.scaleX > 0)
                        this.roleAni.scaleX *= -1;
                }
                else {
                    if (this.roleAni.scaleX < 0)
                        this.roleAni.scaleX *= -1;
                }
                break;
            case 3:
                this.rotation = 0;
                break;
            default:
                this.rotation = this.rotationMove;
        }
    };
    /**角色死亡并回收到对象池**/
    Role.prototype.die = function () {
        //角色动画停止
        this.roleAni.stop();
        //去除所有动画监听
        this.roleAni.offAll();
        //从舞台移除
        this.removeSelf();
        //回收到对象池
        Laya.Pool.recover("role", this);
    };
    return Role;
}(laya.display.Sprite));
//# sourceMappingURL=Role.js.map