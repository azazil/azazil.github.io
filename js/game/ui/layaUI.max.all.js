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
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var game;
(function (game) {
    var ui;
    (function (ui) {
        var GameMainUI = /** @class */ (function (_super) {
            __extends(GameMainUI, _super);
            function GameMainUI() {
                return _super.call(this) || this;
            }
            GameMainUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadUI("GameMain");
            };
            return GameMainUI;
        }(View));
        ui.GameMainUI = GameMainUI;
    })(ui = game.ui || (game.ui = {}));
})(game || (game = {}));
(function (game) {
    var ui;
    (function (ui) {
        var GameStartUI = /** @class */ (function (_super) {
            __extends(GameStartUI, _super);
            function GameStartUI() {
                return _super.call(this) || this;
            }
            GameStartUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadUI("GameStart");
            };
            return GameStartUI;
        }(View));
        ui.GameStartUI = GameStartUI;
    })(ui = game.ui || (game.ui = {}));
})(game || (game = {}));
(function (game) {
    var ui;
    (function (ui) {
        var GameTestUI = /** @class */ (function (_super) {
            __extends(GameTestUI, _super);
            function GameTestUI() {
                return _super.call(this) || this;
            }
            GameTestUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadUI("GameTest");
            };
            return GameTestUI;
        }(View));
        ui.GameTestUI = GameTestUI;
    })(ui = game.ui || (game.ui = {}));
})(game || (game = {}));
//# sourceMappingURL=layaUI.max.all.js.map