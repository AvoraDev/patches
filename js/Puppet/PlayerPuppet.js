import { BasePuppet } from "./BasePuppet.js";
export { PP as PlayerPuppet };

class PP extends BasePuppet {
    // something akin to an enum
    static _ActionStates = Object.freeze({
        Disabled: -1,
        Off: 0,
        Inactive: 1,
        Active: 2
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
        this._ddc = {}; // used for keeping track of disabled flags
        this._ctrs = {
            up: {
                active: () => {
                    if (this.vect.y < -1) this.vect.y -= this._movementStep;
                    else this.vect.y = -1;
                },
                inactive: () => {
                    if (this.vect.y < 0) this.vect.y += this._movementStep;
                    else this._ctrs.up.flag = PP.AS.Off;
                },
                key: 'KeyW',
                flag: PP.AS.Off,
                disabledDuration: 0
            },
            down: {
                active: () => {
                    if (this.vect.y < 1) this.vect.y += this._movementStep;
                    else this.vect.y = 1;
                },
                inactive: () => {
                    if (this.vect.y > 0) this.vect.y -= this._movementStep;
                    else this._ctrs.down.flag = PP.AS.Off;
                },
                key: 'KeyS',
                flag: PP.AS.Off,
                disabledDuration: 0
            },
            left: {
                active: () => {
                    if (this.vect.x < -1) this.vect.x -= this._movementStep;
                    else this.vect.x = -1;
                },
                inactive: () => {
                    if (this.vect.x < 0) this.vect.x += this._movementStep;
                    else this._ctrs.left.flag = PP.AS.Off;
                },
                key: 'KeyA',
                flag: PP.AS.Off,
                disabledDuration: 0
            },
            right: {
                active: () => {
                    if (this.vect.x < 1) this.vect.x += this._movementStep;
                    else this.vect.x = 1;
                },
                inactive: () => {
                    if (this.vect.x > 0) this.vect.x -= this._movementStep;
                    else this._ctrs.right.flag = PP.AS.Off;
                },
                key: 'KeyD',
                flag: PP.AS.Off,
                disabledDuration: 0
            }
        }
    }
    AddAction(name, activeFunc, inactiveFunc, key, startFlag, disabledDuration = 0) {
        if (this._ctrs.hasOwnProperty(name)) {
            console.log(`Warning: '${name}' action already exists. Use another name.`);
            return;
        }

        this._ctrs[name] = {
            active: activeFunc,
            inactive: inactiveFunc,
            key: key,
            flag: startFlag,
            disabledDuration: disabledDuration
        };
    }
    /**
     * Creates event handlers to listen for user input.
     * @returns {void}
     */
    SetupInputHandling() {
        $(window).keydown(e => {
            if (!this.controllable) return;

            Object.keys(this._ctrs).forEach(action => {
                if (this._ctrs[action].flag === PP.AS.Disabled) return;

                if (e.code === this._ctrs[action].key) this._ctrs[action].flag = PP.AS.Active;
            });
        });

        $(window).keyup(e => {
            if (!this.controllable) return;
            
            Object.keys(this._ctrs).forEach(action => {
                if (this._ctrs[action].flag === PP.AS.Disabled) return;
                
                if (e.code === this._ctrs[action].key) this._ctrs[action].flag = PP.AS.Inactive;
            });
        });
    }
    /**
     * Executes the puppet's input actions.
     * @returns {void}
     */
    ActionHandler() {
        Object.keys(this._ctrs).forEach(action => {
            switch(this._ctrs[action].flag) {
                case PP.AS.Disabled:
                    // ignore durations of 0
                    if (this._ctrs[action].disabledDuration === 0) break;

                    // increment tick count
                    if (this._ddc[action] === undefined) this._ddc[action] = 1;
                    else this._ddc[action]++;
                    
                    // reset flag when complete
                    if (this._ddc[action] > this._ctrs[action].disabledDuration) {
                        this._ddc[action] = 0;
                        this._ctrs[action].flag = PP.AS.Off;
                    }
                    break;
                case PP.AS.Off:
                    break;
                case PP.AS.Inactive:
                    this._ctrs[action].inactive();
                    break;
                case PP.AS.Active:
                    this._ctrs[action].active();
                    break;
                default:
                    console.log('Warning: Unknown action state');
                    break;
            }
        });  
    }

    static get AS() {return this._ActionStates;}
}