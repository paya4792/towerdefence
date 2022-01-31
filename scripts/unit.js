// - Unit ----------------------------------------------------------------
function Unit() {
	this.position = new Point();
	this.id = 0;
	this.type = "";
	this.name = "";
	this.size = 0;

	this.angle = 0;

	this.life = 0;
	this.life_max = 0;

	this.ammo_amount = 0;
	this.ammo_amount_max = 0;

	this.reloading_time = 0;
	this.reload_time = 0;

	this.time_after_fire = 0;
	this.interval_of_fire = 0;
	this.rate_of_fire = 600;

	this.accuracy_of_burret = 0;

	this.burret_size = 0;

	this.burret_speed = 0;

	this.burret_damage = 0;

	this.burret_type = 0;

	this.burret_range = 0;

	this.time_until_explode = 0;

	this.flagment_amount_of_explosion = 0;

	this.flagment_size_of_explosion = 0;

	this.flagment_speed_of_explosion = 0;

	this.flagment_damage_of_explosion = 0;

	this.fire_sound = "mg";

	this.range = 0;

	this.alive = false;
}

Unit.prototype.init = function (p, unitID) {

	this.position.x = p.x;
	this.position.y = p.y;

	this.id = unitID;

	this.type = GetUnitType(unitID);
	this.size = GetUnitSize(unitID);

	this.life_max = GetUnitLifeMax(unitID);

	this.ammo_amount_max = GetUnitAmmoMax(unitID);
	this.reload_time = GetUnitReloadTime(unitID);
	this.rate_of_fire = GetUnitRateOfFire(unitID);

	this.accuracy_of_burret = GetUnitAccuracyOfBurret(unitID);

	this.burret_size = GetUnitBurretSize(unitID);
	this.burret_speed = GetUnitBurretSpeed(unitID);
	this.burret_damage = GetUnitBurretDamage(unitID);
	this.burret_type = GetUnitBurretType(unitID);
	this.burret_range = GetUnitBurretRange(unitID);

	this.flagment_amount_of_explosion = GetUnitFlagmentAmount(unitID);
	this.flagment_size_of_explosion = GetUnitFlagmentSize(unitID);
	this.flagment_speed_of_explosion = GetUnitFlagmentSpeed(unitID);
	this.flagment_damage_of_explosion = GetUnitFlagmentDamage(unitID);

	this.fire_sound = GetUnitFireSound(unitID);

	this.interval_of_fire = Math.floor(6000 / this.rate_of_fire);
	this.time_after_fire = this.interval_of_fire;

	this.reloading_time = this.reload_time;
	this.ammo_amount = this.ammo_amount_max;
	this.life = this.life_max;

	this.range = this.burret_range * this.burret_speed;

	this.alive = true;
};


// - character shot -----------------------------------------------------------
function Burret() {
	this.position = new Point();
	this.vector = new Point();
	this.size = 0;
	this.type = 0;
	this.speed = 0;
	this.damage = 0;
	this.range = 0;
	this.time_after_fire = 0;

	this.collided_enemy = -1;

	this.time_until_explode = 0;
	this.flagment_amount_of_explosion = 0;
	this.flagment_size_of_explosion = 0;
	this.flagment_speed_of_explosion = 0;
	this.flagment_damage_of_explosion = 0;

	this.color = "";

	this.alive = false;
}

Burret.prototype.set = function (p, vector, size, speed) {

	this.position.x = p.x;
	this.position.y = p.y;
	this.vector.x = vector.x;
	this.vector.y = vector.y;

	this.size = size;
	this.speed = speed;

	this.time_after_fire = 0;

	this.time_until_explode = 0;
	this.flagment_amount_of_explosion = 0;
	this.flagment_size_of_explosion = 0;
	this.flagment_speed_of_explosion = 0;
	this.flagment_damage_of_explosion = 0;

	this.alive = true;
};

Burret.prototype.move = function () {
	this.time_after_fire++;

	this.position.x += this.vector.x * this.speed;
	this.position.y += this.vector.y * this.speed;

	if (this.time_after_fire > this.range) {
		if (this.type == 2 || this.type == 3) {
			if (this.time_after_fire > this.range * 2) {
				this.time_until_explode = 0;
			}
		} else {
			this.alive = false;
		}
	}

	if (
		this.position.x < -this.size ||
		this.position.y < -this.size ||
		this.position.x > this.size + screenCanvas.width ||
		this.position.y > this.size + screenCanvas.height
	) {
		this.alive = false;
	}
};


function GetUnitID(type, id) {
    for (var i = 0; i < UNIT_LIST.length; i++) {
        if (type == UNIT_LIST[i][1] && id == UNIT_LIST[i][0]) {
            return i;
        }
    }
    return "NONE";
}

function GetUnitType(id) {
    return UNIT_LIST[id][1];
}

function GetUnitName(id) {
    return UNIT_LIST[id][2];
}

function GetUnitDescription(id) {
    return UNIT_LIST[id][3];
}

function GetUnitCost(id) {
    return parseInt(UNIT_LIST[id][4]);
}

function GetUnitSize(id) {
    return parseFloat(UNIT_LIST[id][5]);
}

function GetUnitLifeMax(id) {
    return parseInt(UNIT_LIST[id][6]);
}

function GetUnitAmmoMax(id) {
    return parseInt(UNIT_LIST[id][7]);
}

function GetUnitReloadTime(id) {
    return parseInt(UNIT_LIST[id][8]);
}

function GetUnitRateOfFire(id) {
    return parseInt(UNIT_LIST[id][9]);
}

function GetUnitAccuracyOfBurret(id) {
    return parseInt(UNIT_LIST[id][10]);
}

function GetUnitBurretSize(id) {
    return parseFloat(UNIT_LIST[id][11]);
}

function GetUnitBurretSpeed(id) {
    return parseFloat(UNIT_LIST[id][12]);
}

function GetUnitBurretDamage(id) {
    return parseInt(UNIT_LIST[id][13]);
}

function GetUnitBurretType(id) {
    return parseInt(UNIT_LIST[id][14]);
}

function GetUnitBurretRange(id) {
    return parseInt(UNIT_LIST[id][15]);
}

function GetUnitFlagmentAmount(id) {
    return parseInt(UNIT_LIST[id][16]);
}

function GetUnitFlagmentSize(id) {
    return parseFloat(UNIT_LIST[id][17]);
}

function GetUnitFlagmentSpeed(id) {
    return parseFloat(UNIT_LIST[id][18]);
}

function GetUnitFlagmentDamage(id) {
    return parseInt(UNIT_LIST[id][19]);
}

function GetUnitFireSound(id) {
    return UNIT_LIST[id][20];
}

function GetUnitImage(id) {
    return "images/" + UNIT_LIST[id][21];
}

function GetUnitRange(id) {
    return parseFloat(GetUnitBurretRange(id) * GetUnitBurretSpeed(id));
}