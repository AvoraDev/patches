import { BasePuppet } from "./BasePuppet.js";
export { PP as PlayerPuppet };

class PP extends BasePuppet {
    // something akin to an enum
    static _ActionStates = Object.freeze({
        Disabled: -1,
        Inactive: 0,
        Active: 1
    });
    /**
     * todo - Description
     * @param {Number} x
     * @param {Number} y
     * @param {Object} vect
     * @param {Number} speed NOTE: make sure to change to obj when implemented
     * @param {Object} appearance
     * -- width
     * - height
     * - color
     * @param {Object} Config
     * -- Optional changes
     * - zDepth: int ? 0
     * - collidable: boolean ? true
     * - collisionRebound: boolean ? true
     * - controllable: boolean ? true
     * @param {Boolean} initActionHandling=true
     * @returns {BP}
     */
    constructor(x, y, vect, speed, appearance, config = {}, initActionHandling = true) {
        super(x, y, vect, speed, appearance, config);
        this.controllable = (config.controllable !== undefined) ? config.controllable : true;
        if (initActionHandling) this.SetupInputHandling();

        // todo - implement acceleration and such
        this._movementStep = 0.25;
        this._ctrs = {
            up: {
                active: () => {
                    if (this.vect.y < -1) {
                        this.vect.y -= this._movementStep;
                    } else {
                        this.vect.y = -1;
                    }
                },
                inactive: () => {
                    if (this.vect.y < 0) {
                        this.vect.y += this._movementStep;
                    } else {
                        this._ctrs.up.flag = PP.AS.Disabled;
                    }
                },
                key: 'KeyW',
                flag: -1
            },
            down: {
                active: () => {
                    if (this.vect.y < 1) {
                        this.vect.y += this._movementStep;
                    } else {
                        this.vect.y = 1;
                    }
                },
                inactive: () => {
                    if (this.vect.y > 0) {
                        this.vect.y -= this._movementStep;
                    } else {
                        this._ctrs.down.flag = PP.AS.Disabled;
                    }
                },
                key: 'KeyS',
                flag: -1
            },
            left: {
                active: () => {
                    if (this.vect.x < -1) {
                        this.vect.x -= this._movementStep;
                    } else {
                        this.vect.x = -1;
                    }
                },
                inactive: () => {
                    if (this.vect.x < 0) {
                        this.vect.x += this._movementStep;
                    } else {
                        this._ctrs.left.flag = PP.AS.Disabled;
                    }
                },
                key: 'KeyA',
                flag: -1
            },
            right: {
                active: () => {
                    if (this.vect.x < 1) {
                        this.vect.x += this._movementStep;
                    } else {
                        this.vect.x = 1;
                    }
                },
                inactive: () => {
                    if (this.vect.x > 0) {
                        this.vect.x -= this._movementStep;
                    } else {
                        this._ctrs.right.flag = PP.AS.Disabled;
                    }
                },
                key: 'KeyD',
                flag: -1
            }
        }
    }
    /**
     * Creates event handlers to listen for user input.
     * @returns {void}
     */
    SetupInputHandling() {
        $(window).keydown(e => {
            if (!this.controllable) return;

            Object.keys(this._ctrs).forEach(key => {
                if (e.code === this._ctrs[key].key) this._ctrs[key].flag = PP.AS.Active;
            });
        });

        $(window).keyup(e => {
            if (!this.controllable) return;
            
            Object.keys(this._ctrs).forEach(key => {
                if (e.code === this._ctrs[key].key) this._ctrs[key].flag = PP.AS.Inactive;
            });
        });
    }
    /**
     * Executes the puppet's input actions.
     * @returns {void}
     */
    ActionHandler() {
        Object.keys(this._ctrs).forEach(key => {
            if (this._ctrs[key].flag === PP.AS.Active) this._ctrs[key].active();
            if (this._ctrs[key].flag === PP.AS.Inactive) this._ctrs[key].inactive();
        });  
    }

    static get AS() {return this._ActionStates;}
}