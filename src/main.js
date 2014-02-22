/**
 * @preserve TM-Shooter
 *
 * License
 * http://daishihmr.mit-license.org/
 */

/**
 * @define {boolean}
 */
var STATS = false;

/**
 * @define {boolean}
 *
 * true時：
 *   BGMオフ
 *   右下に隠し情報表示
 *   hキーでハイパーチャージ
 *   pキーでスクリーンショットを撮る
 */
var DEBUG = true;

/**
 * @define {number}
 */
var VERSION = 99.9;

function Gamepad(keymap){
    this.keyboard = null;
    this.keymap   = keymap;
}
Gamepad.prototype = {
    _getGamepadKey : function(key){
        var gamepads = navigator.webkitGetGamepads();
        if(gamepads){
            var gamepad = gamepads[1];    // 僕の環境だけ？
            if(gamepad !== undefined){
                var status = gamepad.buttons[this.keymap[key]] 
                if(status !== undefined && status === 0){
                    return false;
                }
                if(status !== undefined && status === 1){
                    return true;
                }
            }
        }
        return false;
    },
    getKey : function(key){
        if(this.keymap[key] === undefined){
            console.log("getKey() not found " + key);
            return this.keyboard.getKey(key);
        }
        return this._getGamepadKey(key);
    },
    getKeyDown : function(key){
        if(this.keymap[key] === undefined){
            console.log("getKeyDown() not found " + key);
            return this.keyboard.getKeyDown(key);
        }
        return this._getGamepadKey(key);
    }
};

function get_input(){
    var gamepads = navigator.webkitGetGamepads()
    if(! gamepads){
        return null;
    }
    return new Gamepad({
        // PS3 controller
        "x"      : 0,    // bomb | hyper
        "z"      : 1,    // full auto shot
        "c"      : 2,    // shot | lazer
        "escape" : 8,
        "space"  : 9,
        "up"     : 12,
        "down"   : 13,
        "left"   : 14,
        "right"  : 15,
    });
}

tm.preload(function() {
    if (STATS) tm.util.ScriptManager.loadStats();
});
tm.main(function() {
    gls2.GlShooter2("#canvas2d");
    if (STATS) gls2.core.enableStats();

    var input = get_input();
    if(input){
        input.keyboard = gls2.core.keyboard;
        gls2.core.keyboard = input;
        gls2.core.keyboard._update     = input.keyboard._update;
        gls2.core.keyboard.getKeyAngle = input.keyboard.getKeyAngle;
    }
    gls2.core.run();
});
