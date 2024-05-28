import { BasePuppet } from "./BasePuppet.js";
export { PP as PlayerPuppet };

class PP extends BasePuppet {
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
     * @param {Object} config - Optional changes
     * - zDepth: int ? 0
     * - collidable: boolean ? true
     * @returns {BP}
     */
    constructor(x, y, vect, speed, appearance, config = {}) {
        super(x, y, vect, speed, appearance, config = {});

        // todo - implement acceleration and such
        this._movementStep = 0.5;
        this._ctrs = {
            up: {
                action: () => {
                    if (this.vect.y < -1) {
                        this.vect.y -= this._movementStep;
                    } else {
                        this.vect.y = -1;
                    }
                },
                key: 'KeyW',
                flag: false
            },
            down: {
                action: () => {
                    if (this.vect.y < 1) {
                        this.vect.y += this._movementStep;
                    } else {
                        this.vect.y = 1;
                    }
                },
                key: 'KeyS',
                flag: false
            },
            left: {
                action: () => {
                    if (this.vect.x < -1) {
                        this.vect.x -= this._movementStep;
                    } else {
                        this.vect.x = -1;
                    }
                },
                key: 'KeyA',
                flag: false
            },
            right: {
                action: () => {
                    if (this.vect.x < 1) {
                        this.vect.x += this._movementStep;
                    } else {
                        this.vect.x = 1;
                    }
                },
                key: 'KeyD',
                flag: false
            } // ,
            // specialLight: {
            //     action() {
    
            //     },
            //     flag: false
            // },
            // specialHeavy: {
            //     action() {
    
            //     },
            //     flag: false
            // },
        }
    }
    SetupInputHandling() {
        $(window).keydown(e => {
            Object.keys(this._ctrs).forEach(key => {
                if (e.code === this._ctrs[key].key) {
                    this._ctrs[key].flag = true;
                }
            });
        });

        $(window).keyup(e => { 
            Object.keys(this._ctrs).forEach(key => {
                if (e.code === this._ctrs[key].key) {
                    this._ctrs[key].flag = false;
                }
            });
        });
    }
    ActionHandler() {
        Object.keys(this._ctrs).forEach(key => {
            if (this._ctrs[key].flag) {
                this._ctrs[key].action();
            }
        });  
    }
}