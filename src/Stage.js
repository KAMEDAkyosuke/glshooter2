/**
 * @class
 */
gls2.Stage = tm.createClass(
/** @lends {gls2.Stage.prototype} */
{
    /** ステージ中の星アイテムゲット数 */
    starItem: 0,
    /** 撃墜数 */
    killCount: 0,
    /** 出現敵数 */
    enemyCount: 0,

    player: null,
    gameScene: null,

    frame: 0,

    background: null,

    init: function(gameScene, player) {
        var scene = this.gameScene = gameScene;
        this.player = gameScene.player;
        scene.ground.direction = Math.PI*0.4;
        scene.ground.speed = 0.6;

        this.background = tm.graphics.LinearGradient(0, 0, 0, SC_H).addColorStopList([
            { offset:0, color:"#338" },
            { offset:1, color:"#114" }
        ]).toStyle();

        this.frame = 0;
    },

    update: function() {
        var scene = this.gameScene;

        // 敵を出現させる
        var keys = [];
        for (var key in gls2.EnemyUnit) {
            keys.push(key);
        }
        var unit = gls2.EnemyUnit[keys.random()];
        if (this.frame > 200 && this.frame%30 === 0) {
            for (var i = 0, end = unit.length; i < end; i++) {
                this.launchEnemy(unit[i]);
            }
        }

        this.frame += 1;
    },

    launchEnemy: function(data) {
        var enemy = gls2.Enemy.pool.shift();
        if (enemy) {
            this.enemyCount += 1;
            enemy
                .setup(this.gameScene, this, data.soft, data.hard)
                .setPosition(data.x, data.y)
                .addChildTo(this.gameScene)
                .onLaunch();
        } else {
            console.warn("敵が足りない！");
        }
    },

    onDestroyEnemy: function(enemy) {
        this.killCount += 1;
    },

});

gls2.Stage.create = function(gameScene, stageNumber) {
    return gls2.Stage(gameScene);
};
