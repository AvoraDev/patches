import { BasePuppet } from "../BasePuppet.js";
import { PlayerPuppet } from "../PlayerPuppet.js";

export function CombatSetup() {
    BasePuppet.prototype.ImplementCombat = function(hp, atk, spAtk, def, spDef) {
        this.baseStats = {
            hp: hp,
            atk: atk,
            spAtk: spAtk,
            def: def,
            spDef: spDef
        };
        this.condition = { // todo - name
            hp: hp,
            atk: atk,
            spAtk: spAtk,
            def: def,
            spDef: spDef,
            status: []
        };

        this.secondaryGraphics.push(() => {
            BasePuppet.ctx.fillStyle = 'red';
            BasePuppet.ctx.fillRect(
                this.x - (this.hWidth * 1.75),
                this.y - (this.hHeight * 2),
                this.width * 1.75,
                this.height * 0.25
            );

            BasePuppet.ctx.fillStyle = 'green';
            BasePuppet.ctx.fillRect(
                this.x - (this.hWidth * 1.75),
                this.y - (this.hHeight * 2),
                this.width * (1.75 * (this.condition.hp / this.baseStats.hp)),
                this.height * 0.25
            );
        });
    };
}
export function AddDefaultMelee(puppet, key, atkModifier = 1) {
    if (Object.keys(puppet._ctrs).indexOf('melee') !== -1) {
        console.log('Warning: Melee has already been added to this puppet');
        return;
    }

    puppet.AddAction(
        'melee',
        () => {
            console.log(`bonk: ${puppet.atk * atkModifier}`);
            puppet._ctrs.melee.state = PlayerPuppet.AS.Disabled;
        },
        () => {
            puppet._ctrs.melee.state = PlayerPuppet.AS.Off;
        },
        key,
        10
    );

    // note: this constantly runs during draw
    puppet.secondaryGraphics.push(() => {
        if (puppet._ctrs.melee.state !== PlayerPuppet.AS.Disabled) return;

        BasePuppet.ctx.beginPath();
        BasePuppet.ctx.fillStyle = 'rgb(255, 255, 255)';
        BasePuppet.ctx.fillRect(puppet.x, puppet.y, 40, 40);
    });
}