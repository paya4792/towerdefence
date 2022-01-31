// globals
var screenCanvas;
var menuCanvas;
var unitCanvas;

var mouse = new Point();
var ctx;
var ctxmenu;
var ctxunit;
var money = 1000000;
var counter = 0;

var message = "";

var scene = new Scenario();

var isGameStarted = false;
var isRunning = true;
var isGameOver = false;

var isMouseDown = false;
var isMenuflip = false;

var isSettingUnit = false;

var setUnitID = 0;
var setUnitType = 0;

var UNIT_TYPE_LIST = [
    "小銃",
    "短機関銃",
    "軽機関銃",
    "重機関銃",
    "自動装填砲",
    "大砲",
    "迫撃砲",
];

// consts
const FPS = 500 / 30;

const UNIT_COLOR = 'rgba(46, 204, 113,0.04)';
const BURRET_COLOR = 'rgba(241, 196, 15,1.0)';
const UNIT_MAX_COUNT = 8;
const BURRET_MAX_COUNT = 1024;

const ENEMY_COLOR = 'rgba(231, 76, 60,1.0)';
const ENEMY_MAX_COUNT = 64;
const ENEMY_SHOT_COLOR = 'rgba(230, 126, 34,1.0)';
const ENEMY_SHOT_MAX_COUNT = 1024;

const FLOAT_TEXT_MAX_COUNT = 100;

const WALL_MAX_COUNT = 5;

const BUTTON_MAX_COUNT = 8;

const AUDIO_LIST = {
    "6.5mm": new Audio("audios/6.5mm.wav"),
    "7.7mm": new Audio("audios/7.7mm.wav"),
    "7.7mms": new Audio("audios/7.7mms.wav"),
    "9mm": new Audio("audios/9mm.wav"),
    "11mm": new Audio("audios/11mm.wav"),
    "13mm": new Audio("audios/13mm.wav"),
    "20mm": new Audio("audios/20mm.wav"),
    "37mm": new Audio("audios/37mm.wav"),
    "47mm": new Audio("audios/47mm.wav"),
    "75mm": new Audio("audios/75mm.wav"),
    "88mm": new Audio("audios/88mm.wav"),
    "120mm": new Audio("audios/120mm.wav"),
    "150mm": new Audio("audios/150mm.wav"),
    "240mm": new Audio("audios/240mm.wav"),
    "explode": new Audio("audios/explode.wav"),
    "mortar1": new Audio("audios/mortar1.wav"),
    "mortar2": new Audio("audios/mortar2.wav"),
    "mortar3": new Audio("audios/mortar3.wav"),
    "hit": new Audio("audios/hit.wav"),
    "newwave": new Audio("audios/newwave.wav"),
    "button": new Audio("audios/button.wav"),
    "set": new Audio("audios/set.wav"),
    "gameover": new Audio("audios/gameover.wav"),
    "regain": new Audio("audios/regain.wav"),
    "coin": new Audio("audios/coin.wav"),
    "destroyed": new Audio("audios/destroyed.wav"),
    "error": new Audio("audios/error.wav"),
};

// initialize Screen
screenCanvas = document.getElementById('screen');
screenCanvas.width = 800;
screenCanvas.height = 600;

menuCanvas = document.getElementById('menu');
menuCanvas.width = 1000;
menuCanvas.height = 120;

unitCanvas = document.getElementById('unit');
unitCanvas.width = 194;
unitCanvas.height = 600;

// initialize Unit
var unit = new Array(UNIT_MAX_COUNT);
for (i = 0; i < UNIT_MAX_COUNT; i++) {
    unit[i] = new Unit();
}

// initialize FloatText
var floatText = new Array(FLOAT_TEXT_MAX_COUNT);
for (i = 0; i < FLOAT_TEXT_MAX_COUNT; i++) {
    floatText[i] = new FloatText();
}

// initialize Wall
var wall = new Array(WALL_MAX_COUNT);
for (i = 0; i < WALL_MAX_COUNT; i++) {
    wall[i] = new Wall();
    wall[i].init(i);
}

// initialize button

var button = new Array(BUTTON_MAX_COUNT);
for (i = 0; i < BUTTON_MAX_COUNT; i++) {
    button[i] = new Button();
    button[i].size.x = 136;
    button[i].size.y = 64;

    button[i].position.x = button[i].size.x + (i * button[i].size.x) + (i * 6) + 8;
    button[i].position.y = 48;

    button[i].roll = i;
}

window.onload = function () {
    startMenu();
}
// main
function main() {

    // load unit data
    var data = document.getElementById("csv").text.trim();

    convertCSVtoArray(data);


    // 
    var i, j;
    var p = new Point();
    audio = new Audio();


    // 2d context
    ctx = screenCanvas.getContext('2d');
    ctxmenu = menuCanvas.getContext('2d');
    ctxunit = unitCanvas.getContext('2d');

    // events
    screenCanvas.addEventListener('mousemove', mouseMove, true);
    screenCanvas.addEventListener('mousedown', mouseDown, true);
    screenCanvas.addEventListener('mouseup', mouseUp, true);

    menuCanvas.addEventListener('click', click, true);

    //initialize cursor
    var cursor = new Cursor();
    cursor.init(5);

    // reinitialize units
    for (i = 0; i < UNIT_MAX_COUNT; i++) {
        unit[i] = new Unit();
    }

    // reinitialize floattext
    for (i = 0; i < FLOAT_TEXT_MAX_COUNT; i++) {
        floatText[i] = new FloatText();
    }

    // initialize burrets
    var burrets = new Array(BURRET_MAX_COUNT);
    for (i = 0; i < BURRET_MAX_COUNT; i++) {
        burrets[i] = new Burret();
    }

    // initialize enemy
    var enemy = new Array(ENEMY_MAX_COUNT);
    for (i = 0; i < ENEMY_MAX_COUNT; i++) {
        enemy[i] = new Enemy();
    }

    // initialize enemyshot
    var enemyShot = new Array(ENEMY_SHOT_MAX_COUNT);
    for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        enemyShot[i] = new EnemyShot();
    }

    // Rendering
    (function () {

        if (!isGameStarted) {
            setTimeout(arguments.callee, FPS);
            return;
        }

        // display canvas
        screenCanvas.style.display = "inline";
        menuCanvas.style.display = "block";
        unitCanvas.style.display = "inline";

        //screen clear
        ctx.fillStyle = "rgba(25,20,25,0.6)";
        ctx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

        // render cursor
        // ---
        cursor.position.x = mouse.x;
        cursor.position.y = mouse.y;

        ctx.beginPath();
        ctx.arc(
            cursor.position.x,
            cursor.position.y,
            cursor.size,
            0, Math.PI * 2, false
        );

        ctx.fillStyle = "rgba(255,128,128,0.7)";
        ctx.fill();
        ctx.closePath();

        if (isSettingUnit && GetUnitID(setUnitType, setUnitID) != "NONE") {
            ctx.beginPath();
            ctx.arc(
                cursor.position.x,
                cursor.position.y,
                GetUnitRange(GetUnitID(setUnitType, setUnitID)),
                0, Math.PI * 2, false
            );

            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.fill();
            ctx.closePath();
        }

        if (isRunning && !isGameOver) {
            // increment counter
            counter++;
            if(counter % 60 == 0){
                money += 1;
            }
            scene.continue();
            // ---

            // unit shot burret
            // ---
            var shotted = false;
            var maxVolume = 0.05;
            for (i = 0; i < UNIT_MAX_COUNT; i++) {
                // set unit angle
                unit[i].angle = Math.atan2(cursor.position.y - unit[i].position.y, cursor.position.x - unit[i].position.x) + Math.PI / 2;

                // if unit can fire
                if (isMouseDown && unit[i].ammo_amount > 0 && unit[i].time_after_fire >= unit[i].interval_of_fire && unit[i].alive && !isSettingUnit && !shotted) {
                    // check all burrets
                    for (j = 0; j < BURRET_MAX_COUNT; j++) {
                        if (!burrets[j].alive) {
                            p = unit[i].position.distance(cursor.position);

                            p.x += Math.floor(Math.random() * (100 - unit[i].accuracy_of_burret));
                            p.x -= Math.floor(Math.random() * (100 - unit[i].accuracy_of_burret));
                            p.y += Math.floor(Math.random() * (100 - unit[i].accuracy_of_burret));
                            p.y -= Math.floor(Math.random() * (100 - unit[i].accuracy_of_burret));

                            p.normalize();

                            burrets[j].set(unit[i].position, p, unit[i].burret_size, unit[i].burret_speed);
                            burrets[j].damage = unit[i].burret_damage;
                            burrets[j].type = unit[i].burret_type;
                            burrets[j].range = unit[i].burret_range;
                            burrets[j].color = "rgba(251, 197, 49,1.0)";

                            if (burrets[j].type == 2 || burrets[j].type == 3) {

                                var far = Math.floor(Math.sqrt((unit[i].position.x - cursor.position.x) *
                                    (unit[i].position.x - cursor.position.x) +
                                    (unit[i].position.y - cursor.position.y) *
                                    (unit[i].position.y - cursor.position.y)));

                                burrets[j].time_until_explode = far / burrets[j].speed * 2;

                                burrets[j].flagment_amount_of_explosion = unit[i].flagment_amount_of_explosion;
                                burrets[j].flagment_size_of_explosion = unit[i].flagment_size_of_explosion;
                                burrets[j].flagment_speed_of_explosion = unit[i].flagment_speed_of_explosion;
                                burrets[j].flagment_damage_of_explosion = unit[i].flagment_damage_of_explosion;

                            }

                            AUDIO_LIST[unit[i].fire_sound].volume = maxVolume;
                            AUDIO_LIST[unit[i].fire_sound].play();
                            AUDIO_LIST[unit[i].fire_sound] = new Audio(AUDIO_LIST[unit[i].fire_sound].src);
                            maxVolume /= 2;
                            shotted = false;
                            break;
                        }
                    }
                    unit[i].time_after_fire = 0;
                    unit[i].ammo_amount -= 1;
                }
                if (unit[i].time_after_fire <= unit[i].interval_of_fire) {
                    unit[i].time_after_fire += 1;
                }
                if (unit[i].ammo_amount <= 0) {
                    unit[i].reloading_time += 1;
                }
                if (unit[i].reloading_time >= unit[i].reload_time) {
                    unit[i].ammo_amount = unit[i].ammo_amount_max;
                    unit[i].reloading_time = 0;
                }
            }
            // ---

            // burret explode
            // ---
            for (i = 0; i < BURRET_MAX_COUNT; i++) {
                if (burrets[i].alive && (burrets[i].type == 2 || burrets[i].type == 3)) {

                    burrets[i].time_after_fire++;

                    if (burrets[i].time_after_fire > burrets[i].time_until_explode) {
                        var time_after_fired = 0;

                        for (j = 0; j < BURRET_MAX_COUNT; j++) {
                            if (!burrets[j].alive) {

                                p.x += Math.floor(Math.random() * screenCanvas.width);
                                p.x -= Math.floor(Math.random() * screenCanvas.width);
                                p.y += Math.floor(Math.random() * screenCanvas.height);
                                p.y -= Math.floor(Math.random() * screenCanvas.height);

                                p.normalize();

                                burrets[j].set(burrets[i].position, p, burrets[i].flagment_size_of_explosion, burrets[i].flagment_speed_of_explosion);
                                burrets[j].damage = burrets[i].flagment_damage_of_explosion;
                                burrets[j].type = 4;
                                burrets[j].range = 10;
                                burrets[j].color = "rgba(232, 65, 24,1.0)";

                                time_after_fired++;
                            }
                            if (time_after_fired > burrets[i].flagment_amount_of_explosion) {
                                AUDIO_LIST["explode"].volume = 0.05;
                                AUDIO_LIST["explode"].play();
                                AUDIO_LIST["explode"] = new Audio(AUDIO_LIST["explode"].src);
                                burrets[i].type = 0;
                                burrets[i].alive = false;
                                break;
                            }
                        }
                    }
                }
            }
            // ---

            // spawn enemy
            // ---
            if (scene.canSpawn()) {
                for (i = 0; i < ENEMY_MAX_COUNT; i++) {
                    if (!enemy[i].alive) {
                        var type = Math.floor(Math.random() * Math.floor(2));
                        p.x = -100;
                        p.y = -100;
                        enemy[i].set(p, type, scene.enemy());
                        if (type == 0) {
                            enemy[i].position.x = screenCanvas.width - 40;
                            enemy[i].position.y = -enemy[i].size;
                        } else {
                            enemy[i].position.x = 40;
                            enemy[i].position.y = -enemy[i].size;
                        }
                        break;
                    }
                }
            }
            // ---

            // check collide
            // ---

            for (i = 0; i < BURRET_MAX_COUNT; i++) {
                if (burrets[i].alive) {
                    for (j = 0; j < ENEMY_MAX_COUNT; j++) {
                        if (enemy[j].alive) {
                            p = enemy[j].position.distance(burrets[i].position);
                            var pos = burrets[i].position;
                            if (p.length() < enemy[j].size) {
                                var damageNum = 0;
                                switch (burrets[i].type) {
                                    case 1:
                                        if (burrets[i].collided_enemy != j) {
                                            enemy[j].life -= burrets[i].damage;
                                            burrets[i].collided_enemy = j;
                                            burrets[i].range -= burrets[i].damage;
                                            damageNum = burrets[i].damage;
                                        }
                                        break;
                                    case 2:
                                        burrets[i].time_until_explode = 0;
                                        break;
                                    case 3:

                                        break;
                                    case 4:
                                        enemy[j].life -= burrets[i].damage;
                                        burrets[i].type = 5;
                                        damageNum = burrets[i].damage;
                                        break;
                                    case 5:
                                        break;
                                    default:
                                        enemy[j].life -= burrets[i].damage;
                                        burrets[i].alive = false;
                                        damageNum = burrets[i].damage;
                                        break;
                                }

                                if (damageNum > 0) {
                                    for (var k = 0; k < FLOAT_TEXT_MAX_COUNT; k++) {
                                        if (!floatText[k].enable) {
                                            floatText[k].set(pos, damageNum.toString(), 28, "rgba(251, 197, 49,1.0)", 30, true);
                                            break;
                                        }
                                    }
                                }

                                break;
                            }
                        }
                    }
                    for (j = 0; j < WALL_MAX_COUNT; j++) {
                        if (wall[j].checkHit(burrets[i].position.x, burrets[i].position.y)) {
                            switch (burrets[i].type) {
                                case 1:
                                    burrets[i].range -= burrets[i].damage;
                                    break;
                                case 2:
                                    burrets[i].time_until_explode = 0;
                                    break;
                                case 3:

                                    break;
                                case 4:
                                    burrets[i].random -= 1;
                                    break;
                                case 5:
                                    break;
                                default:
                                    burrets[i].alive = false;
                                    break;
                            }
                        }
                    }
                    for (j = 0; j < UNIT_MAX_COUNT; j++) {
                        if (unit[j].alive && burrets[i].type == 4) {
                            p = unit[j].position.distance(burrets[i].position);
                            if (p.length() < unit[j].size) {
                                unit[j].life -= 1;
                                burrets[i].alive = false;
                                break;
                            }
                        }
                    }
                }
            }

            for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
                if (enemyShot[i].alive) {
                    for (j = 0; j < UNIT_MAX_COUNT; j++) {
                        if (unit[j].alive) {
                            p = unit[j].position.distance(enemyShot[i].position);
                            if (p.length() < unit[j].size) {
                                for (var k = 0; k < FLOAT_TEXT_MAX_COUNT; k++) {
                                    if (!floatText[k].enable) {
                                        floatText[k].set(unit[j].position, "1", 28, "rgba(194, 54, 22,1.0)", 30, true);
                                        break;
                                    }
                                }
                                AUDIO_LIST["hit"].volume = maxVolume;
                                AUDIO_LIST["hit"].play();
                                AUDIO_LIST["hit"] = new Audio(AUDIO_LIST["hit"].src);
                                unit[j].life -= 1;
                                enemyShot[i].alive = false;
                                break;
                            }
                        }
                    }
                    for (j = 0; j < WALL_MAX_COUNT; j++) {
                        if (wall[j].checkHit(enemyShot[i].position.x, enemyShot[i].position.y)) {
                            enemyShot[i].alive = false;
                        }
                    }
                }
            }

            for (i = 0; i < ENEMY_MAX_COUNT; i++) {
                if (enemy[i].alive && enemy[i].life <= 0) {
                    money += enemy[i].reward;
                    enemy[i].alive = false;
                    AUDIO_LIST["coin"].volume = 0.1;
                    AUDIO_LIST["coin"].play();
                    AUDIO_LIST["coin"] = new Audio(AUDIO_LIST["coin"].src);
                }
            }

            for (i = 0; i < UNIT_MAX_COUNT; i++) {
                if (unit[i].alive && unit[i].life <= 0) {
                    AUDIO_LIST["destroyed"].volume = 0.1;
                    AUDIO_LIST["destroyed"].play();
                    AUDIO_LIST["destroyed"] = new Audio(AUDIO_LIST["destroyed"].src);
                    unit[i].alive = false;
                }else if(unit[i].alive && counter % 300 == 0 && unit[i].life < unit[i].life_max){
                    unit[i].life += 1;
                    AUDIO_LIST["regain"].volume = 0.1;
                    AUDIO_LIST["regain"].play();
                    AUDIO_LIST["regain"] = new Audio(AUDIO_LIST["regain"].src);
                    for (var k = 0; k < FLOAT_TEXT_MAX_COUNT; k++) {
                        if (!floatText[k].enable) {
                            floatText[k].set(unit[i].position, "1", 28, "rgba(76, 209, 55,1.0)", 30, true);
                            break;
                        }
                    }
                }
            }




        // ---

        } else if (!isGameOver) {
            ctx.fillStyle = "rgba(245, 246, 250,1.0)";
            ctx.font = "bold 48px azuki";
            ctx.fillText("停止中", 16, 64);

        }

        ctx.fillStyle = "rgba(245, 246, 250,1.0)";
        ctx.font = "bold 48px azuki";
        ctx.fillText("↓", 16, 64);
        ctx.fillText("↓", 736, 64);
        ctx.fillText("×", 16, 590);
        ctx.fillText("×", 736, 590);

        // render walls
        // ---
        for (i = 0; i < WALL_MAX_COUNT; i++) {
            ctx.fillStyle = "rgba(255, 255, 255,1.0)";
            ctx.fillRect(wall[i].xpos, wall[i].ypos, wall[i].xlength, wall[i].ylength);
        }
        // ---

        // render enemy
        // ---
        ctx.beginPath();
        for (i = 0; i < ENEMY_MAX_COUNT; i++) {

            if (enemy[i].alive) {
                ctx.arc(
                    enemy[i].position.x,
                    enemy[i].position.y,
                    enemy[i].size,
                    0, Math.PI * 2, false
                );
                ctx.closePath();
                if (isRunning) {
                    enemy[i].move();

                    if (enemy[i].param % enemy[i].interval_of_fire === 0) {

                        for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {

                            if (!enemyShot[j].alive) {
                                // enemy want to shoot nearly
                                var far;
                                var farMin = 65535.0;
                                var currentTarget = -1;

                                for (var k = 0; k < UNIT_MAX_COUNT; k++) {
                                    if (unit[k].alive) {
                                        far = Math.sqrt((enemy[i].position.x - unit[k].position.x) *
                                            (enemy[i].position.x - unit[k].position.x) +
                                            (enemy[i].position.y - unit[k].position.y) *
                                            (enemy[i].position.y - unit[k].position.y));
                                        if (farMin > far) {
                                            farMin = far;
                                            currentTarget = k;
                                        }
                                    }
                                }
                                if (currentTarget != -1) {
                                    p = enemy[i].position.distance(unit[currentTarget].position);
                                    p.x += Math.floor(Math.random() * 50);
                                    p.x -= Math.floor(Math.random() * 50);
                                    p.y += Math.floor(Math.random() * 50);
                                    p.y -= Math.floor(Math.random() * 50);
                                    p.normalize();
                                    enemyShot[j].set(enemy[i].position, p, 2, 4);
                                }

                                break;
                            }
                        }
                    }
                }
            }
        }

        ctx.fillStyle = ENEMY_COLOR;

        ctx.fill();
        ctx.closePath();

        // enemy shot
        // ---
        ctx.beginPath();

        for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
            if (enemyShot[i].alive) {
                if (isRunning) {
                    enemyShot[i].move();
                }
                ctx.arc(
                    enemyShot[i].position.x,
                    enemyShot[i].position.y,
                    enemyShot[i].size,
                    0, Math.PI * 2, false
                );

                ctx.closePath();
            }
        }

        ctx.fillStyle = ENEMY_SHOT_COLOR;

        ctx.fill();
        ctx.closePath();

        // ---



        // render Unit 
        // ---
        ctx.beginPath();
        for (i = 0; i < UNIT_MAX_COUNT; i++) {
            if (unit[i].alive) {

                ctx.arc(
                    unit[i].position.x,
                    unit[i].position.y,
                    GetUnitRange(unit[i].id),
                    0, Math.PI * 2, false
                );
                ctx.closePath();
            }

        }
        ctx.fillStyle = UNIT_COLOR;
        ctx.fill();
        ctx.closePath();

        for (i = 0; i < UNIT_MAX_COUNT; i++) {
            if (unit[i].alive) {

                ctx.save();
                var img = new Image();
                var comp_size = unit[i].size * 3;
                var size = unit[i].size * 6;
                img.src = GetUnitImage(unit[i].id);

                ctx.translate(unit[i].position.x, unit[i].position.y);
                ctx.rotate(unit[i].angle);
                ctx.drawImage(img, -comp_size, - comp_size, size, size);

                ctx.restore();
            }

        }

        // ---



        // render burrets
        // ---
        for (i = 0; i < BURRET_MAX_COUNT; i++) {
            ctx.beginPath();
            if (burrets[i].alive) {
                if (isRunning) {
                    burrets[i].move();
                }
                ctx.arc(
                    burrets[i].position.x,
                    burrets[i].position.y,
                    burrets[i].size,
                    0, Math.PI * 2, false
                );
            }

            ctx.fillStyle = burrets[i].color;
            ctx.fill();
            ctx.closePath();
        }
        // ---

        // render unit info
        ctxunit.fillStyle = "rgba(113, 128, 147,1.0)";
        ctxunit.fillRect(0, 0, unitCanvas.width, unitCanvas.height);

        ctxunit.fillStyle = "rgba(240,240,240,0.8)";
        ctxunit.fillRect(8, 8, 178, 32);

        ctxunit.fillStyle = 'rgba(0,0,0,1)';
        ctxunit.font = "bold 24px azuki";
        ctxunit.fillText('UNIT INFO', 48, 32, 114);

        for (i = 0; i < UNIT_MAX_COUNT; i++) {

            var offset = 4 * i + (i * 64);

            ctxunit.fillStyle = "rgba(240,240,240,0.8)";
            ctxunit.fillRect(8, 48 + offset, 178, 64);

            if (unit[i].alive) {
                ctxunit.fillStyle = 'rgba(0,0,0,1)';
                ctxunit.font = "bold 20px azuki";
                ctxunit.fillText(UNIT_LIST[unit[i].id][2], 16, 72 + offset, 114);

                // life
                ctxunit.fillStyle = "rgba(47, 54, 64,1.0)";
                ctxunit.fillRect(12, 80 + offset, 168, 16);

                ctxunit.fillStyle = "rgba(68, 189, 50,1.0)";
                ctxunit.fillRect(14, 82 + offset, 164 * (unit[i].life / unit[i].life_max), 12);

                // ammo info
                ctxunit.fillStyle = "rgba(47, 54, 64,1.0)";
                ctxunit.fillRect(40, 100 + offset, 48, 8);

                ctxunit.font = "bold 12px azuki";
                ctxunit.fillText("AMMO", 10, 108 + offset);

                ctxunit.fillStyle = "rgba(156, 136, 255,1.0)";
                ctxunit.fillRect(42, 102 + offset, 44 * (unit[i].ammo_amount / unit[i].ammo_amount_max), 4);

                // reload info
                ctxunit.fillStyle = "rgba(47, 54, 64,1.0)";
                ctxunit.fillRect(132, 100 + offset, 48, 8);

                ctxunit.fillText("RELOAD", 96, 108 + offset);

                ctxunit.fillStyle = "rgba(225, 177, 44,1.0)";
                ctxunit.fillRect(178, 102 + offset, -44 * (unit[i].reloading_time / unit[i].reload_time), 4);


            } else {
                ctxunit.fillStyle = 'rgba(0,0,0,1)';
                ctxunit.font = "bold 32px azuki";
                ctxunit.fillText('NO UNIT', 44, 92 + offset, 114);
            }
        }

        // render damage
        for (i = 0; i < FLOAT_TEXT_MAX_COUNT; i++) {
            if (floatText[i].enable) {
                floatText[i].render();
                ctx.fillStyle = floatText[i].color;
                ctx.font = "bold " + floatText[i].size.toString() + "px azuki";
                ctx.fillText(floatText[i].text, floatText[i].position.x, floatText[i].position.y);

                ctx.strokeStyle = "rgba(245, 246, 250,0.5)";
                ctx.font = "bold " + floatText[i].size.toString() + "px azuki";
                ctx.lineWidth = 0.2;
                ctx.strokeText(floatText[i].text, floatText[i].position.x, floatText[i].position.y);

            }
        }

        // render menu
        ctxmenu.fillStyle = "rgba(113, 128, 147,1.0)";
        ctxmenu.fillRect(0, 0, menuCanvas.width, menuCanvas.height);

        ctxmenu.fillStyle = "rgba(240,240,240,0.8)";
        ctxmenu.fillRect(8, 8, 178, 32);

        ctxmenu.fillRect(194, 8, 178, 32);

        ctxmenu.fillRect(380, 8, 608, 32);

        if (isMenuflip) {
            // render flip button
            ctxmenu.fillStyle = "rgba(240,240,240,0.8)";
            ctxmenu.fillRect(8, 48, 128, 64);

            ctxmenu.fillStyle = 'rgba(0,0,0,1)';
            ctxmenu.font = "bold 24px azuki";
            ctxmenu.fillText('戻る', 12, 72);

            // render buttons
            for (i = 0; i < BUTTON_MAX_COUNT; i++) {
                var unit_id = GetUnitID(setUnitType, button[i].roll);

                if (unit_id != "NONE") {
                    button[i].isEnable = true;
                    ctxmenu.fillStyle = "rgba(240,240,240,0.8)";
                    ctxmenu.fillRect(button[i].position.x,
                        button[i].position.y,
                        button[i].size.x,
                        button[i].size.y);

                    ctxmenu.fillStyle = 'rgba(0,0,0,1)';
                    ctxmenu.font = "bold 18px azuki";
                    ctxmenu.fillText(GetUnitName(unit_id),
                        button[i].position.x + 4,
                        button[i].position.y + 20,
                        120);
                    ctxmenu.fillText("雇用料:" + GetUnitCost(unit_id),
                        button[i].position.x + 4,
                        button[i].position.y + 48,
                        120);
                }
            }

        } else {
            // render flip button
            ctxmenu.fillStyle = "rgba(240,240,240,0.8)";
            for (i = 0; i < UNIT_TYPE_LIST.length; i++) {
                ctxmenu.fillRect(8 + 142 * i, 48, 128, 64);
            }
            ctxmenu.fillStyle = 'rgba(0,0,0,1)';
            ctxmenu.font = "bold 24px azuki";

            for (i = 0; i < UNIT_TYPE_LIST.length; i++) {
                ctxmenu.fillText(UNIT_TYPE_LIST[i], 12 + 142 * i, 72, 108);
            }


        }
        ctxmenu.fillStyle = 'rgba(0,0,0,1)';
        ctxmenu.font = "bold 24px azuki";
        ctxmenu.fillText('UNIT LIST', 48, 32);

        ctxmenu.fillStyle = 'rgba(0,0,0,1)';
        ctxmenu.font = "bold 18px azuki";
        ctxmenu.fillText(message,
            384,
            32,
            604);
        ctxmenu.fillText("現在の所持金:" + money.toString(), 196, 32, 178);

        if (isSettingUnit && isMenuflip && GetUnitID(setUnitType, setUnitID) != "NONE") {
            message = GetUnitDescription(GetUnitID(setUnitType, setUnitID));
        }else{
            message = message;
        }

        // Loop
        if (true) { setTimeout(arguments.callee, FPS); }
    })();
};

// mouse events
// ---
function mouseMove(event) {
    mouse.x = event.clientX - screenCanvas.offsetLeft;
    mouse.y = event.clientY - screenCanvas.offsetTop;
}

function mouseDown(event) {
    isMouseDown = true;

    if (isSettingUnit) {
        var canSet = true;
        var setted = false;
        var nomoney = false;
        var onWall = false;
        for (i = 0; i < WALL_MAX_COUNT; i++) {
            if (wall[i].checkHit(mouse.x, mouse.y)) {
                onWall = true;
                canSet = false;
                break;
            }
        }


        for (i = 0; i < UNIT_MAX_COUNT; i++) {
            if (!unit[i].alive && canSet) {
                if (money >= GetUnitCost(GetUnitID(setUnitType, setUnitID))) {
                    var p = new Point();
                    p.x = mouse.x;
                    p.y = mouse.y;

                    unit[i].init(p, GetUnitID(setUnitType, setUnitID));
                    AUDIO_LIST["set"].volume = 0.1;
                    AUDIO_LIST["set"].play();
                    AUDIO_LIST["set"] = new Audio(AUDIO_LIST["set"].src);
                    setted = true;
                    money -= GetUnitCost(GetUnitID(setUnitType, setUnitID));
                    break; 
                }else{
                    nomoney = true;
                }
            }
        }
        if(nomoney){
            message = "所持金が足りません！";
            isSettingUnit = false; 
        }else if(!setted && canSet){
            message = "これ以上ユニットを配置できません！";
            isSettingUnit = false;
        }else if(onWall){
            message = "壁の上にユニットを配置することはできません！";
            isSettingUnit = false;
        }
        if(!isSettingUnit){
            AUDIO_LIST["error"].volume = 0.1;
            AUDIO_LIST["error"].play();
            AUDIO_LIST["error"] = new Audio(AUDIO_LIST["error"].src);
        }


    }
    if (!isGameOver) {
        isRunning = true;
    }
}

function mouseUp(event) {
    isMouseDown = false;
    if (isSettingUnit) {
        isSettingUnit = false;
    }
}
// ---

// menu event
function click(event) {

    var mouseX = event.clientX - menuCanvas.offsetLeft;
    var mouseY = event.clientY - menuCanvas.offsetTop;

    // if menuflip button
    if (!isMenuflip) {
        isRunning = false;
        if (mouseY > 48 && mouseY < 112) {

            for (i = 0; i < UNIT_TYPE_LIST.length; i++) {
                if (mouseX > 8 + 142 * i && mouseX < (8 + 142 * i) + 128) {
                    AUDIO_LIST["button"].volume = 0.1;
                    AUDIO_LIST["button"].play();
                    AUDIO_LIST["button"] = new Audio(AUDIO_LIST["button"].src);
                    setUnitType = UNIT_TYPE_LIST[i];
                    isMenuflip = true;
                    break;
                }
            }

        }
    }
    // if purchase button
    else {
        if (mouseY > 48 && mouseY < 112 && mouseX > 16 && mouseX < 152 && !isGameOver) {
            isMenuflip = false;
            isRunning = true;
            isSettingUnit = false;
            setUnitID = 0;
            setUnitType = 0;
            AUDIO_LIST["button"].volume = 0.1;
            AUDIO_LIST["button"].play();
            AUDIO_LIST["button"] = new Audio(AUDIO_LIST["button"].src);
        }

        for (var i = 0; i < BUTTON_MAX_COUNT; i++) {
            if (button[i].isEnable && !isGameOver) {
                if (mouseX > button[i].position.x &&
                    mouseX < button[i].position.x + button[i].size.x &&
                    mouseY > button[i].position.y &&
                    mouseY < button[i].position.y + button[i].size.y) {
                    AUDIO_LIST["button"].volume = 0.1;
                    AUDIO_LIST["button"].play();
                    AUDIO_LIST["button"] = new Audio(AUDIO_LIST["button"].src);
                    isSettingUnit = true;
                    setUnitID = i;
                    isRunning = false;
                    break;
                }
            }
        }
    }
}