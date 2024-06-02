import { BasePuppet } from "../BasePuppet.js";
import { PlayerPuppet } from "../PlayerPuppet.js";

export function CombatSetup() {
    BasePuppet.prototype.ImplementCombat = function(hp, atk, spAtk, def, spDef) {
        this.hp = hp;
        this.atk = atk;
        this.spAtk = spAtk;
        this.def = def;
        this.spDef = spDef;
    };
}
export function AddDefaultMelee(puppet, key, atkModifier = 1) {
    puppet.AddAction(
        'melee',
        function() {
            console.log(`bonk: ${puppet.atk * atkModifier}`);
            BasePuppet.ctx.beginPath();
            BasePuppet.ctx.fillStyle = 'rgb(255, 255, 255)';
            BasePuppet.ctx.fillRect(puppet.x, puppet.y, puppet.x + 40, puppet.y + 40);
            console.log(puppet._ddc);
            puppet._ctrs.melee.flag = PlayerPuppet.AS.Disabled;
        },
        function() {
            this.flag = PlayerPuppet.AS.Off;
        },
        key,
        10
    );
}