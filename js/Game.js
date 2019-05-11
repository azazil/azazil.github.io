var Sprite = laya.display.Sprite;
var Loader = laya.net.Loader;
var Texture = laya.resource.Texture;
var Handler = laya.utils.Handler;
var Browser = laya.utils.Browser;
var TiledMap = laya.map.TiledMap;
var Rectangle = laya.maths.Rectangle;
var Stat = laya.utils.Stat;
var TextFiled = laya.display.Text;
var LocalStorage = laya.net.LocalStorage;
/**
* Game
* 游戏入口类
*/
var Game = /** @class */ (function () {
    function Game() {
        this.stageW = Browser.onQQBrowser ? Browser.width / Browser.pixelRatio : Browser.clientWidth;
        this.stageH = Browser.onQQBrowser ? Browser.height / Browser.pixelRatio : Browser.clientHeight;
        this.beanSingleNumInit = 0;
        this.beanMaxNum = 0;
        this.beanNum = 0;
        this.beanOrder = 0;
        this.beans = {};
        this.SnakeAINum = 0;
        this.snakeAIArr = [];
        this._init();
        Stat.show(200, 10);
    }
    //屏幕适配、初始化舞台
    Game.prototype._init = function () {
        this.stageW = 600;
        this.stageH = Browser.height / Browser.width * this.stageW;
        Laya.init(this.stageW, this.stageH, Laya.WebGL);
        Laya.stage.scaleMode = Laya.Stage.SCALE_NOBORDER;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.stage.bgColor = "#555555";
        //加载资源
        this._load();
        //对屏幕改小改变进行监听
        Browser.window.onresize = onWindowResize;
    };
    Game.prototype._onresizeAction = function () {
        this.loading && this.loading.pos(this.stageW / 2, this.stageH / 2);
        this.gameStartUI && this.gameStartUI.pos(this.stageW / 2, this.stageH / 2);
        this.gameMainUI && (this.gameMainUI.mask_rank.x = (this.stageW - this.gameMainUI.mask_rank.width - 10));
        this.gameMainUI && this.gameMainUI.ctrl_flash.pos(this.stageW + this.gameMainUI.ctrl_flash.width, this.stageH - this.gameMainUI.ctrl_flash.height);
        this.gameMainUI && this.gameMainUI.ctrl_back.pos(this.gameMainUI.ctrl_back.width, this.stageH - this.gameMainUI.ctrl_back.height);
    };
    //加载资源
    Game.prototype._load = function () {
        var _this = this;
        this.loading = new TextFiled();
        this.loading = new TextFiled();
        this.loading.text = "正在加载资源，请稍后...";
        this.loading.color = "#000000";
        this.loading.font = "Microsoft YaHei";
        this.loading.pos(this.stageW / 2, this.stageH / 2);
        this.loading.pivot(this.loading.width / 2, this.loading.height / 2);
        Laya.stage.addChild(this.loading);
        //加载资源
        Laya.loader.load("res/atlas/images.atlas", Laya.Handler.create(this, function () {
            //资源加载完成则进入开始界面
            // this.gameStartSence()
            _this.gameMain();
        }), null, Laya.Loader.ATLAS);
        Laya.loader.load("map/tile_map.png");
        Laya.loader.load("images/head1.png");
        Laya.loader.load("images/head2.png");
        Laya.loader.load("images/head3.png");
        Laya.loader.load("images/head4.png");
        Laya.loader.load("images/head5.png");
    };
    //开始界面
    Game.prototype.gameStartSence = function () {
        this.gameStartUI = new GameStart();
        this.gameStartUI.pos(this.stageW / 2, this.stageH / 2);
        this.gameStartUI.btn_single.on("click", this, this.gameStart, [0]);
        this.gameStartUI.btn_net.on("click", this, this.gameStart, [1]);
        Laya.stage.addChild(this.gameStartUI);
        Laya.stage.removeChild(this.loading);
        this.loading.destroy();
    };
    //开始游戏，进入GameMain
    Game.prototype.gameStart = function (gameMode) {
        this.nickname = this.gameStartUI.nickname.label;
        this.neturl = this.gameStartUI.neturl.label;
        this.skin = this.gameStartUI.skinRadio.selectedIndex;
        this.gameMode = gameMode;
        Laya.stage.removeChild(this.gameStartUI);
        this.gameMain();
    };
    //进行游戏
    Game.prototype.gameMain = function () {
        this.gameMainUI = new GameMain();
        this.gameMainUI.map.pos(this.stageW / 2, this.stageH / 2);
        this.gameMainUI.mask_rank.x = this.stageW - this.gameMainUI.mask_rank.width - 10;
        this.gameMainUI.ctrl_flash.pos(this.stageW + this.gameMainUI.ctrl_flash.width, this.stageH - this.gameMainUI.ctrl_flash.height);
        this.gameMainUI.ctrl_back.pos(-this.gameMainUI.ctrl_back.width, this.stageH - this.gameMainUI.ctrl_back.height);
        Laya.stage.addChild(this.gameMainUI);
        this.roleLayer = this.roleLayer || new Sprite();
        this.gameMainUI.map.addChild(this.roleLayer);
        this.ammoLayer = this.ammoLayer || new Sprite();
        this.gameMainUI.map.addChild(this.ammoLayer);
        for (var _bean_i = 0; _bean_i < this.beanSingleNumInit; _bean_i++) {
            this.beanOrder++;
            this.addBean(this.beanOrder);
        }
        this.addBeanRandom();
        //创建主角
        this.snakeSelf = new Snake();
        this.gameMainUI.map.addChild(this.snakeSelf);
        //新NPC样式
        // setInterval(() => {
        //     //创建弹药，从对象池创建
        //     let role: Role = Laya.Pool.getItemByClass("role", Role);
        //     //初始化角色类型，血量与速度
        //     role = new Role(this.snakeSelf.x, this.snakeSelf.y)
        //     //添加到舞台上
        //     this.roleLayer.addChild(role);
        // }, 1000)
        //创建NPC
        // for (let index = 0; index < this.SnakeAINum; index++) {
        //     let snakeAI: Snake = new Snake(Math.floor(Math.random() * (5 - 1 + 1) + 1), this.gameMainUI.map.width * Math.random(), this.gameMainUI.map.height * Math.random())
        //     snakeAI.AI = true
        //     this.snakeAIArr.push(snakeAI)
        //     this.gameMainUI.map.addChild(snakeAI)
        // }
        // this.snakeAIRotation()
        this.createEnemy();
        this.shoot();
        Laya.timer.loop(20, this, this.gameLoop);
    };
    //游戏主循环
    Game.prototype.gameLoop = function () {
        this.heroAct();
        this.enemyAct();
        this.ammoMove();
        this.mapMove();
        this.eateBean();
        this.gameMainUI.text_length.text = this.roleLayer.numChildren + "";
        this.gameMainUI.text_kill.text = this.snakeSelf.kill + "";
    };
    Game.prototype.eateBean = function () {
        for (var key in this.beans) {
            var bean = this.beans[key];
            // if (bean.haveEaten) {//确定了有被吃对象
            //     let x = (bean.speed) * Math.cos(Math.atan2(bean.eatenInitPos["y"] - bean.y, bean.eatenInitPos["x"] - bean.x))
            //     let y = (bean.speed) * Math.sin(Math.atan2(bean.eatenInitPos["y"] - bean.y, bean.eatenInitPos["x"] - bean.x))
            //     bean.x += x
            //     bean.y += y
            //     bean.eatenPos["x"] += x
            //     bean.eatenPos["x"] += y
            //     // console.log(distance(bean.eatenPos["x"], bean.eatenPos["y"], bean.eatenInitPos["x"], bean.eatenInitPos["x"]))
            //     if (distance(bean.x, bean.y, bean.eatenInitPos["x"], bean.eatenInitPos["y"]) < bean.haveEatenDis) {
            //         bean.destroy()
            //         this.beans[key] = undefined
            //         delete this.beans[key]
            //         this.snakeSelf.snakeLength++
            //         this.snakeSelf.eatBean++
            //         this.beanNum--
            //     }
            // } else if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= (this.snakeSelf.width / 2) + 20) {
            //     bean.eatenTarget = this.snakeSelf
            //     bean.eatenInitPos["x"] = this.snakeSelf.x + this.snakeSelf.speed * 10 * Math.cos(this.snakeSelf.rotation * Math.PI / 180)
            //     bean.eatenInitPos["y"] = this.snakeSelf.y + this.snakeSelf.speed * 10 * Math.sin(this.snakeSelf.rotation * Math.PI / 180)
            //     bean.haveEaten = true
            // }
            if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= this.snakeSelf.width / 2) {
                bean.destroy();
                this.beans[key] = undefined;
                delete this.beans[key];
                this.snakeSelf.snakeLength++;
                this.snakeSelf.eatBean++;
                this.beanNum--;
            }
            else if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= (this.snakeSelf.width / 2) + 20) {
                bean.x += (this.snakeSelf.speed + 0.1) * Math.cos(Math.atan2(this.snakeSelf.y - bean.y, this.snakeSelf.x - bean.x));
                bean.y += (this.snakeSelf.speed + 0.1) * Math.sin(Math.atan2(this.snakeSelf.y - bean.y, this.snakeSelf.x - bean.x));
            }
            // //屏蔽npc吃豆子
            // for (let index = 0; index < this.snakeAIArr.length; index++) {
            //     let element = this.snakeAIArr[index]
            //     if (distance(bean.x, bean.y, element.x, element.y) <= element.width / 2) {
            //         bean.destroy()
            //         this.beans[key] = undefined
            //         delete this.beans[key]
            //         element.snakeLength++
            //         element.eatBean++
            //         this.beanNum--
            //     } else if (distance(bean.x, bean.y, element.x, element.y) <= (element.width / 2) + 20) {
            //         bean.x += (bean.speed) * Math.cos(Math.atan2(element.y - bean.y, element.x - bean.x))
            //         bean.y += (bean.speed) * Math.sin(Math.atan2(element.y - bean.y, element.x - bean.x))
            //     }
            // }
        }
    };
    //做地图相对移动，以便能让玩家的蛇始终居中，且不会超出屏幕
    Game.prototype.mapMove = function () {
        //镜头不会超出边界
        // if (this.snakeSelf.x >= this.gameMainUI.map.width - this.snakeSelf.width / 2 - this.stageW / 2) {
        //     this.gameMainUI.map.x = this.stageW - this.gameMainUI.map.width / 2
        // } else if (this.snakeSelf.x <= this.stageW / 2 - this.snakeSelf.width / 2) {
        //     this.gameMainUI.map.x = this.gameMainUI.map.width / 2
        // } else {
        //     this.gameMainUI.map.x = this.stageW / 2 - (this.snakeSelf.x + this.snakeSelf.width / 2 - this.gameMainUI.map.width / 2)
        // }
        // if (this.snakeSelf.y >= this.gameMainUI.map.height - this.snakeSelf.height / 2 - this.stageH / 2) {
        //     this.gameMainUI.map.y = this.stageH - this.gameMainUI.map.height / 2
        // } else if (this.snakeSelf.y <= this.stageH / 2 - this.snakeSelf.height / 2) {
        //     this.gameMainUI.map.y = this.gameMainUI.map.height / 2
        // } else {
        //     this.gameMainUI.map.y = this.stageH / 2 - (this.snakeSelf.y + this.snakeSelf.height / 2 - this.gameMainUI.map.height / 2)
        // }
        //镜头会超出屏幕
        this.gameMainUI.map.x = this.stageW / 2 - (this.snakeSelf.x + this.snakeSelf.width / 2 - this.gameMainUI.map.width / 2);
        this.gameMainUI.map.y = this.stageH / 2 - (this.snakeSelf.y + this.snakeSelf.height / 2 - this.gameMainUI.map.height / 2);
    };
    Game.prototype.addBean = function (beanOrder, x, y, colorNum) {
        var bean = new Bean(x, y, colorNum);
        bean.orderNum = beanOrder;
        this.beans[beanOrder] = bean;
        this.gameMainUI.map.addChild(bean);
        this.beanNum++;
    };
    Game.prototype.addBeanRandom = function () {
        var _this = this;
        this.beanRandomTimer = setInterval(function () {
            if (_this.beanNum < _this.beanMaxNum) {
                for (var index = 0; index < 20; index++) {
                    _this.beanOrder++;
                    _this.addBean(_this.beanOrder);
                }
            }
        }, 100);
    };
    // snakeAIMove(): void {
    //     for (let index = 0; index < this.snakeAIArr.length; index++) {
    //         let snakeAI = this.snakeAIArr[index]
    //         snakeAI.move()
    //         let hitDis: number = 90 / snakeAI.speedObj["rotation"] * snakeAI.speed + snakeAI.width / 2
    //         let hitPos: Object = { x: 0, y: 0 }
    //         hitPos["x"] = hitDis * Math.cos(snakeAI.rotation * Math.PI / 180) + snakeAI.x
    //         hitPos["y"] = hitDis * Math.sin(snakeAI.rotation * Math.PI / 180) + snakeAI.y
    //         let hiten: Boolean = false
    //         //判断是否快碰撞到边界
    //         if (hitPos["x"] >= this.gameMainUI.map.width - snakeAI.width / 2 || hitPos["x"] <= snakeAI.width / 2
    //             || hitPos["y"] >= this.gameMainUI.map.height - snakeAI.width / 2 || hitPos["y"] <= snakeAI.width / 2) {
    //             snakeAI.reverseRotation()
    //         }
    //         //判断是否撞倒玩家蛇
    //         if (distance(hitPos["x"], hitPos["y"], this.snakeSelf.x, this.snakeSelf.y) <= this.snakeSelf.width) {
    //             this.snakeSelf.hp--
    //             // snakeAI.reverseRotation()
    //             hiten = true
    //         }
    //         for (let index = 0; index < this.snakeSelf.bodyArr.length; index++) {
    //             if (hiten) break
    //             let element = this.snakeSelf.bodyArr[index];
    //             if (distance(hitPos["x"], hitPos["y"], element.x, element.y) <= element.width) {
    //                 snakeAI.reverseRotation()
    //                 hiten = true
    //             }
    //         }
    //         //判断AI之间是否自己碰撞
    //         for (let i = 0; i < this.snakeAIArr.length; i++) {
    //             if (hiten) break
    //             let elementSnakeAI: Snake = this.snakeAIArr[i];
    //             if (index == i) continue
    //             if (distance(hitPos["x"], hitPos["y"], elementSnakeAI.x, elementSnakeAI.y) <= elementSnakeAI.width) {
    //                 snakeAI.reverseRotation()
    //                 hiten = true
    //             }
    //             for (let index = 0; index < elementSnakeAI.bodyArr.length; index++) {
    //                 if (hiten) break
    //                 let element = elementSnakeAI.bodyArr[index];
    //                 if (distance(hitPos["x"], hitPos["y"], element.x, element.y) <= element.width) {
    //                     snakeAI.reverseRotation()
    //                     hiten = true
    //                 }
    //             }
    //         }
    //     }
    // }
    // snakeAIRotation(): void {
    //     for (let index = 0; index < this.snakeAIArr.length; index++) {
    //         this.snakeAIArr[index].targetR = 180 - Math.random() * 360
    //         this.snakeAIArr[index].speedNow = "slow"
    //     }
    //     setInterval(() => {
    //         // //随机转向
    //         // for (let index = 0; index < this.snakeAIArr.length; index++) {
    //         //     this.snakeAIArr[index].targetR = 180 - Math.random() * 360
    //         //     this.snakeAIArr[index].speedNow = Math.random() > 0.9 ? "fast" : "slow"
    //         // }
    //         //朝向主角移动
    //         for (let index = 0; index < this.snakeAIArr.length; index++) {
    //             this.snakeAIArr[index].targetR = Math.atan2(this.snakeSelf.y - this.snakeAIArr[index].y, this.snakeSelf.x - this.snakeAIArr[index].x) * 180 / Math.PI
    //         }
    //     }, 1000)
    // }
    Game.prototype.createEnemy = function () {
        var _this = this;
        setInterval(function () {
            if (_this.roleLayer.numChildren < 100) {
                var role = Laya.Pool.getItemByClass("role", Role);
                //初始化角色类型，血量与速度
                var size = randomInt(1, 3);
                role = new Role(_this.gameMainUI.map.width * Math.random(), _this.gameMainUI.map.height * Math.random(), 40, size);
                //添加到舞台上
                // let targetR = Math.atan2(this.snakeSelf.y - role.y, this.snakeSelf.x - role.x) * 180 / Math.PI
                // role.roleAni.rotation = targetR
                _this.roleLayer.addChild(role);
            }
        }, 1000);
    };
    Game.prototype.heroAct = function () {
        if (this.snakeSelf.speed == 0) {
            var targetPos = { x: 0, y: 0 };
            var dis = 100000;
            for (var i = this.roleLayer.numChildren - 1; i > -1; i--) {
                var role = this.roleLayer.getChildAt(i);
                var dis2 = distance(role.x, role.y, this.snakeSelf.x, this.snakeSelf.y);
                if (dis2 < dis) {
                    dis = dis2;
                }
                targetPos['x'] = role.x;
                targetPos['y'] = role.y;
                break;
            }
            this.snakeSelf.targetR = Math.atan2(targetPos['y'] - this.snakeSelf.y, targetPos['x'] - this.snakeSelf.x) * 180 / Math.PI;
        }
        this.snakeSelf.move();
    };
    Game.prototype.enemyAct = function () {
        for (var i = this.roleLayer.numChildren - 1; i > -1; i--) {
            var role = this.roleLayer.getChildAt(i);
            role.targetR = Math.atan2(this.snakeSelf.y - role.y, this.snakeSelf.x - role.x) * 180 / Math.PI;
            role.move();
        }
    };
    Game.prototype.shoot = function () {
        var _this = this;
        setInterval(function () {
            //创建弹药，从对象池创建
            var ammo = Laya.Pool.getItemByClass("ammo", Ammo);
            //初始化角色类型，血量与速度
            ammo = new Ammo(_this.snakeSelf.x, _this.snakeSelf.y, 1, 1, 10, _this.snakeSelf.rotation, 1, "ammo1");
            //添加到舞台上
            _this.ammoLayer.addChild(ammo);
        }, 100);
    };
    Game.prototype.ammoMove = function () {
        //遍历所有弹药，更改弹药状态
        for (var i = this.ammoLayer.numChildren - 1; i > -1; i--) {
            //获取第一个角色
            var ammo = this.ammoLayer.getChildAt(i);
            var hitPos = { x: 0, y: 0 };
            hitPos["x"] = ammo.speed * Math.cos(ammo.rotation * Math.PI / 180) + ammo.x;
            hitPos["y"] = ammo.speed * Math.sin(ammo.rotation * Math.PI / 180) + ammo.y;
            ammo.pos(hitPos["x"], hitPos["y"]);
            //超出射程或者地图范围后回收
            if (distance(hitPos["x"], hitPos["y"], this.snakeSelf.x, this.snakeSelf.y) > ammo.range) {
                ammo.die();
                break;
            }
            //判定是否击中敌人
            var isHit = false;
            for (var j = this.roleLayer.numChildren - 1; j > -1; j--) {
                var role = this.roleLayer.getChildAt(j);
                if (distance(hitPos["x"], hitPos["y"], role.x, role.y) <= role.hitRadius) {
                    if (role.roleSize <= 1) {
                        role.die();
                        this.snakeSelf.kill++;
                    }
                    else {
                        role.roleSize = role.roleSize - 0.2;
                        role.roleAni.scale(role.roleSize, role.roleSize);
                    }
                    isHit = true;
                    break;
                }
            }
            if (isHit) {
                ammo.die();
                break;
            }
        }
    };
    return Game;
}());
//当屏幕大小改变时回调
function onWindowResize() {
    game.stageW = Browser.onQQBrowser ? Browser.width / Browser.pixelRatio : Browser.width / Browser.pixelRatio;
    game.stageH = Browser.onQQBrowser ? Browser.height / Browser.pixelRatio : Browser.height / Browser.pixelRatio;
    Laya.stage.size(game.stageW, game.stageH);
    //屏幕大小改变时发生的改变
    game._onresizeAction();
}
//计算距离
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
function randomInt(i, j) {
    if (i === void 0) { i = 0; }
    if (j === void 0) { j = 1; }
    if (i == 0) {
        return Math.floor(Math.random() * j);
    }
    else {
        return Math.floor(Math.random() * (j - i)) + i;
    }
}
var game = new Game();
//# sourceMappingURL=Game.js.map