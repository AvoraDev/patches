import { BasePuppet } from "../BasePuppet.js";
import { PlayerPuppet } from "../PlayerPuppet.js";
import { HelperPuppet } from "./HelperPuppet.js";

export function CombatSetup() {
    BasePuppet.prototype.ImplementCombat = function(hp, atk, spAtk, def, spDef) {
        if (this.baseStats !== undefined || this.condition !== undefined) {
            console.log('Warning: stats have already been added to this puppet');
            return;
        }

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

        // health bar graphic
        this.secondaryGraphics.push(() => {
            // base
            BasePuppet.ctx.fillStyle = 'red';
            BasePuppet.ctx.fillRect(
                this.x - (this.hWidth * 1.75),
                this.y - (this.hHeight * 2),
                this.width * 1.75,
                this.height * 0.25
            );

            // actual hp
            BasePuppet.ctx.fillStyle = 'rgb(0, 255, 100)';
            BasePuppet.ctx.fillRect(
                this.x - (this.hWidth * 1.75),
                this.y - (this.hHeight * 2),
                this.width * (1.75 * (this.condition.hp / this.baseStats.hp)),
                this.height * 0.25
            );
        });
    };

    BasePuppet.prototype.AddMelee = function(key, atkModifier = 1) {
        // warning jazz
        if (Object.keys(this._ctrs).indexOf('melee') !== -1) {
            console.log('Warning: Melee has already been added to this puppet');
            return;
        } else if (this.baseStats !== undefined || this.condition !== undefined) {
            console.log('Warning: Run .ImplementCombat() before using this function');
            console.log('Note: decide if this should be a thing (you better remember what that means)');
            return;
        }

        // what do i even name this lol
        // i swear the amount of math this project makes me do
        // is gonna make my brain implode
        let sizeMultiplier = 0.5
        this.foo = new HelperPuppet(
            this,
            sizeMultiplier,
            {
                x: this.hWidth + (this.width * (sizeMultiplier / 2)),
                y: this.hWidth + (this.width * (sizeMultiplier / 2))
            }
        );
    
        this.AddAction(
            'melee',
            () => {
                console.log(`bonk: ${this.atk * atkModifier}`);
                this.foo._check_ = true;

                // nreanjkaenjkgka
                this._ctrs.melee.state = PlayerPuppet.AS.Disabled;
            },
            () => {
                this.foo._check_ = false;
                this._ctrs.melee.state = PlayerPuppet.AS.Off;
            },
            key,
            10
        );

        // note: this constantly runs during draw
        // this.secondaryGraphics.push(() => {
        //     if (this._ctrs.melee.state !== PlayerPuppet.AS.Disabled) return;
    
        //     BasePuppet.ctx.beginPath();
        //     BasePuppet.ctx.fillStyle = 'rgb(255, 255, 255)';
        //     BasePuppet.ctx.fillRect(this.x, this.y, 40, 40);
        // });
    }
}