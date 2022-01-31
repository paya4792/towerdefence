var scenario_now = 0;
var enemySpawnedAmount = 0;

function Scenario() {

}

Scenario.prototype.canSpawn = function () {
    if (enemySpawnedAmount < 10 && scenario_now == 1) {
        if (counter % 60 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    } else if (enemySpawnedAmount < 20 && scenario_now == 2) {
        if (counter % 60 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    } else if (enemySpawnedAmount < 40 && scenario_now == 3) {
        if (counter % 60 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }else if (enemySpawnedAmount < 50 && scenario_now == 4) {
        if (counter % 45 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 70 && scenario_now == 5) {
        if (counter % 50 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 90 && scenario_now == 6) {
        if (counter % 30 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 110 && scenario_now == 7) {
        if (counter % 50 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 120 && scenario_now == 8) {
        if (counter % 70 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 130 && scenario_now == 9) {
        if (counter % 70 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 145 && scenario_now == 10) {
        if (counter % 25 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 180 && scenario_now == 11) {
        if (counter % 45 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 200 && scenario_now == 12) {
        if (counter % 35 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 210 && scenario_now == 13) {
        if (counter % 30 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 240 && scenario_now == 14) {
        if (counter % 45 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 270 && scenario_now == 15) {
        if (counter % 20 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 300 && scenario_now == 16) {
        if (counter % 15 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 320 && scenario_now == 17) {
        if (counter % 40 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 350 && scenario_now == 18) {
        if (counter % 45 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 400 && scenario_now == 19) {
        if (counter % 35 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }
    else if (enemySpawnedAmount < 450 && scenario_now == 20) {
        if (counter % 10 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    } else if(enemySpawnedAmount >= 450){
        if (counter % 30 === 0) {
            enemySpawnedAmount += 1;
            return true;
        }
    }


    return false;
}

Scenario.prototype.continue = function () {
    if (scenario_now == 0) {
        this.nextWave();
    } else if (counter == 1800 * scenario_now) {
        this.nextWave();
    }
}

Scenario.prototype.enemy = function () {
    switch (scenario_now) {
        case 1: return 0;
        case 2: return 1;
        case 3: return 0;
        case 4: return 1;
        case 5: return 2;
        case 6: return 0;
        case 7: return 1;
        case 8: return 2;
        case 9: return 3;
        case 10: return 0;
        case 11: return 1;
        case 12: return 2;
        case 13: return 3;
        case 14: return 4;
        case 15: return 0;
        case 16: return 1;
        case 17: return 2;
        case 18: return 3;
        case 19: return 4;
        case 20: return 5;
        default : return Math.floor(Math.random() * 5.0);
    }
}

Scenario.prototype.nextWave = function () {
    scenario_now += 1;
    AUDIO_LIST["newwave"].volume = 0.1;
    AUDIO_LIST["newwave"].play();
    AUDIO_LIST["newwave"] = new Audio(AUDIO_LIST["newwave"].src);
    for (var k = 0; k < FLOAT_TEXT_MAX_COUNT; k++) {
        if (!floatText[k].enable) {
            var pos = new Point;
            var str = "WAVE" + scenario_now.toString();
            pos.x = 260;
            pos.y = 360;
            floatText[k].set(pos, str, 128, "rgba(194, 54, 22,1.0)", 120, true);
            break;
        }
    }
}

Scenario.prototype.gameOver = function () {
    isRunning = false;
    isGameOver = true;
    for (var k = 0; k < FLOAT_TEXT_MAX_COUNT; k++) {
        if (!floatText[k].enable) {
            var pos = new Point;
            var str = "GAME OVER";
            pos.x = 120;
            pos.y = 360;
            floatText[k].set(pos, str, 128, "rgba(194, 54, 22,1.0)", 120, true);
            break;
        }
    }
    AUDIO_LIST["gameover"].volume = 0.1;
    AUDIO_LIST["gameover"].play();
    AUDIO_LIST["gameover"] = new Audio(AUDIO_LIST["gameover"].src);

    // reload page
    setTimeout("location.reload()", 5000);
}