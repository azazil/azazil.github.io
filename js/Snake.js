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
var Snake = /** @class */ (function (_super) {
    __extends(Snake, _super);
    function Snake(colorNum, x, y) {
        if (colorNum === void 0) { colorNum = Math.floor(Math.random() * (1 - 1 + 1) + 1); }
        if (x === void 0) { x = game.gameMainUI.map.width / 2; }
        if (y === void 0) { y = game.gameMainUI.map.height / 2; }
        var _this = _super.call(this) || this;
        _this.roleType = 1; //  角色类型   1 主角  2 敌人  3 主角护卫
        _this.allyType = 2; // 阵营类型  1己方,2敌人
        _this.bodyType = 1; // 身体类型   1单体 ,2蛇形
        _this.speedObj = { "slow": 2, "normal": 8, "fast": 6, "stop": 0, "rotation": 360 };
        _this.speedNow = "stop";
        _this.snakeInitSize = 1; //初始体型大小
        _this.snakeLength = 4; //初始尾巴长度
        _this.kill = 0;
        _this.rotateSpeed = _this.speedObj['rotation'];
        _this.bodyArr = [];
        _this.pathArr = [];
        _this.eatBean = 0;
        _this.bodyBeanNum = 1; //吃几颗豆增加一节身体
        _this.bodyMaxNum = 10;
        _this.initWidth = 40;
        _this.hp = 10;
        _this.shootInterval = 300;
        _this.shootTime = 300;
        _this.AI = false;
        _this.speed = _this.speedObj[_this.speedNow];
        _this.targetR = _this.rotation;
        _this.colorNum = colorNum;
        _this.visible = false;
        _this.snakeSize = _this.snakeInitSize;
        _this.loadImage("images/head" + _this.colorNum + ".png", 0, 0, 0, 0, new Handler(_this, _this.loaded, [x, y]));
        return _this;
    }
    Snake.prototype.loaded = function (x, y) {
        this.zOrder = 11000;
        this.initWidth = this.width;
        this.rotationTemp = this.rotation;
        // this.snakeScale(this)
        this.pivot(this.width / 2, this.height / 2);
        this.pos(x, y);
        this.visible = true;
        this.bodySpace = Math.floor(this.width / 10 * 20);
        for (var index = 1; index <= this.getBodyNum(); index++) {
            this.addBody(this.x - index * this.bodySpace, this.y, this.rotation);
        }
        for (var index = 0; index < this.bodySpace * this.getBodyNum(); index++) {
            this.pathArr.push({
                x: this.x - index,
                y: this.y
            });
        }
    };
    Snake.prototype.move = function () {
        this.bodySpace = Math.floor(this.width / 10 * 8);
        this.headMove();
        this.bodyMove();
        this.speedChange();
        this.rotationChange();
        this.bodyCheck();
    };
    Snake.prototype.moveOut = function () {
        //碰到边界了
    };
    Snake.prototype.headMove = function () {
        var xb, yb;
        if (this.rotateSpeed < 0) { //  转向速度小于0,瞬间转向
            xb = this.speed * Math.cos(this.targetR * Math.PI / 180);
            yb = this.speed * Math.sin(this.targetR * Math.PI / 180);
            this.rotation = this.targetR;
        }
        else {
            xb = this.speed * Math.cos(this.rotation * Math.PI / 180);
            yb = this.speed * Math.sin(this.rotation * Math.PI / 180);
            this.rotation = this.rotationTemp;
        }
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
        //设置移动轨迹
        for (var index = 1; index <= this.speed; index++) {
            this.pathArr.unshift({
                x: index * Math.cos(Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x)) + posBefore.x,
                y: index * Math.sin(Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x)) + posBefore.y
            });
        }
    };
    Snake.prototype.bodyMove = function () {
        for (var index = 0; index < this.bodyArr.length; index++) {
            var element = this.bodyArr[index];
            if (this.pathArr[(index + 1) * this.bodySpace]) {
                element.rotation = Math.atan2(this.pathArr[(index + 1) * this.bodySpace]["y"] - element.y, this.pathArr[(index + 1) * this.bodySpace]["x"] - element.x) / Math.PI * 180;
                element.pos(this.pathArr[(index + 1) * this.bodySpace]["x"], this.pathArr[(index + 1) * this.bodySpace]["y"]);
            }
            if (this.pathArr.length > this.bodyArr.length * (1 + this.bodySpace)) {
                this.pathArr.pop();
            }
        }
    };
    Snake.prototype.snakeScale = function (ele, eleType) {
        if (eleType === void 0) { eleType = "head"; }
        var x = ele.x, y = ele.y, zOrder = ele.zOrder;
        ele.pivot(ele.width / 2, ele.height / 2);
        ele.graphics.clear();
        ele.loadImage("images/" + eleType + this.colorNum + ".png", 0, 0, this.initWidth * this.snakeSize, this.initWidth * this.snakeSize);
        ele.pivot(ele.width / 2, ele.height / 2);
        ele.pos(x, y);
        // this.speedObj["rotation"] = 4 / this.snakeSize
    };
    Snake.prototype.speedChange = function () {
        //速度逐渐加快
        this.speed = this.speedNow == 'slow' ?
            (this.speed > this.speedObj[this.speedNow] ? this.speed - 1 : this.speedObj[this.speedNow])
            : (this.speed < this.speedObj[this.speedNow] ? this.speed + 1 : this.speedObj[this.speedNow]);
    };
    Snake.prototype.rotationChange = function () {
        var perRotation = Math.abs(this.targetR - this.rotationTemp) < this.speedObj['rotation'] ? Math.abs(this.targetR - this.rotationTemp) : this.speedObj['rotation'];
        if (this.targetR < -0 && this.rotationTemp > 0 && Math.abs(this.targetR) + this.rotationTemp > 180) {
            perRotation = (180 - this.rotationTemp) + (180 + this.targetR) < this.speedObj['rotation'] ? (180 - this.rotationTemp) + (180 + this.targetR) : this.speedObj['rotation'];
            this.rotationTemp += perRotation;
        }
        else {
            this.rotationTemp += this.targetR > this.rotationTemp && Math.abs(this.targetR - this.rotationTemp) <= 180 ? perRotation : -perRotation;
        }
        this.rotationTemp = Math.abs(this.rotationTemp) > 180 ? (this.rotationTemp > 0 ? this.rotationTemp - 360 : this.rotationTemp + 360) : this.rotationTemp;
    };
    Snake.prototype.addBody = function (x, y, r) {
        var _this = this;
        var body = new Sprite();
        var zOrder = this.zOrder - this.bodyArr.length - 1;
        body.visible = false;
        body.alpha = 0;
        body.zOrder = zOrder;
        body.loadImage("images/body" + this.colorNum + ".png", 0, 0, 0, 0, new Handler(this, function () {
            _this.snakeScale(body, "body");
            body.pos(x, y);
            body.rotation = r;
            game.gameMainUI.map.addChild(body);
            body.visible = true;
            body.alpha = 1;
        }));
        this.bodyArr.push(body);
    };
    Snake.prototype.bodyCheck = function () {
        var _this = this;
        if (this.eatBean >= this.bodyBeanNum && this.bodyArr.length < this.bodyMaxNum) {
            var addBodyNum = Math.floor(this.eatBean / this.bodyBeanNum);
            var x = this.bodyArr[this.bodyArr.length - 1].x;
            var y = this.bodyArr[this.bodyArr.length - 1].y;
            var r = this.bodyArr[this.bodyArr.length - 1].rotation;
            for (var index = 0; index < addBodyNum; index++) {
                this.addBody(this.bodySpace * Math.cos(r * Math.PI / 180), this.bodySpace * Math.sin(r * Math.PI / 180), r);
            }
            for (var index = 0; index < this.bodySpace * addBodyNum; index++) {
                this.pathArr.push({
                    x: this.x - index * Math.cos(r * Math.PI / 180),
                    y: this.y - index * Math.sin(r * Math.PI / 180)
                });
            }
            this.eatBean = this.eatBean % this.bodyBeanNum;
            if (this.snakeSize < 1) {
                this.snakeSize = this.snakeInitSize + (1 - this.snakeInitSize) / this.bodyMaxNum * this.bodyArr.length;
                this.bodyArr.forEach(function (element) {
                    _this.snakeScale(element, "body");
                });
                // for (let index = this.bodyArr.length - 1; index >= 0; index--) {
                //     this.snakeScale(this.bodyArr[index], "body")
                // }
                this.snakeScale(this);
            }
            else {
                this.snakeSize = 1;
            }
        }
    };
    Snake.prototype.getBodyNum = function () {
        // return Math.floor(this.snakeLength / this.bodyBeanNum)
        return Math.floor(this.snakeLength);
    };
    Snake.prototype.reverseRotation = function () {
        this.targetR = this.rotation > 0 ? this.rotation - 180 : this.rotation + 180;
    };
    return Snake;
}(laya.display.Sprite));
//# sourceMappingURL=Snake.js.map