import { Paintbrush } from "./Paintbrush.js";
export { BP as BasePuppet };

class BP {
    static paintbrush = {};
    static ctx = {};
    static Playground = [];
    static Config = {
        playground: {
            margin: 0,
            debug: false
        },
        collision: {
            substeps: 5,
            rbBuffer: 0.25 
        }
    };
    static _home = [];

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
     * @returns {BP}
     */
    constructor(x, y, vect, speed, appearance, config = {}) {
        this.x = x;
        this.y = y;
        this.vect = vect;
        this.speed = speed;
        this.width = appearance.width;
        this.height = appearance.height;
        this.color = appearance.color;

        // optional changes
        this.zDepth =           (config.zDepth !== undefined) ? config.zDepth : 0;
        this.collidable =       (config.collidable !== undefined) ? config.collidable : true;
        this.collisionRebound = (config.collisionRebound !== undefined) ? config.collisionRebound : true;
        
        // todo - implement
        this.cheats = {
            noClip: false
        };

        // add to home
        BP._home.push(this);
        BP._home.sort(function(a, b) {return a.zDepth - b.zDepth});
    }
    /**
     * Options:
     * - xyActual
     * - bb
     * @param {String} color
     * @param {String[]} ...args
     * @returns {void}
     */
    Debug(color, ...args) {
        // set colors
        BP.ctx.strokeStyle = color;
        BP.ctx.fillStyle = color;
        
        // args sounds cool 
        args.forEach(item => {
            switch (item) {
                case 'xyActual':
                    BP.ctx.beginPath();
                    BP.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                    BP.ctx.fill();
                    break;
                case 'pinpoint':
                    BP.ctx.beginPath();
                    BP.ctx.moveTo(0, this.y);
                    BP.ctx.lineTo(BP.paintbrush.width, this.y);
                    BP.ctx.moveTo(this.x, 0);
                    BP.ctx.lineTo(this.x, BP.paintbrush.height);
                    BP.ctx.stroke();
                    break;
                case 'hitbox':
                    // todo - implement
                    break;
                default:
                    console.log(`Warning: ${item} is not a valid argument`);
                    break;
            }
        });
    }
    _invertVect(axis) {
        this.vect[axis] = -this.vect[axis];
    }
    _move() {
        // prevent dividing by zero
        if ((this.vect.x === 0) && (this.vect.y === 0)) return;

        let mag = Math.sqrt(this.vect.x**2 + this.vect.y**2);
        this.x += (this.vect.x / mag) * this.speed;
        this.y += (this.vect.y / mag) * this.speed;
    }
    _playgroundCollisionDetection() {
        // left
        if (this.x - this.hWidth < BP.Playground[0].x) {
            this.x = BP.Playground[0].x + this.hWidth;

            if (this.collisionRebound) this._invertVect('x');
        }
        
        // right
        if (this.x + this.hWidth > BP.Playground[1].x) {
            this.x = BP.Playground[1].x - this.hWidth;
            
            if (this.collisionRebound) this._invertVect('x');
        }

        // top
        if (this.y - this.hHeight < BP.Playground[0].y) {
            this.y = BP.Playground[0].y + this.hHeight;

            if (this.collisionRebound) this._invertVect('y');
        }

        // bottom
        if (this.y + this.hHeight > BP.Playground[1].y) {
            this.y = BP.Playground[1].y - this.hHeight;

            if (this.collisionRebound) this._invertVect('y');
        }
    }
    _ptpCollisionDetection() {
        // broad phase
        /* custom
        get distance between coords of both puppets
        if the distance is shorter than the width/height of both puppets, they are overlapping
        */
        let selfIdx = BP._home.indexOf(this);
        let possibleCollisions = [];
        BP._home.forEach((puppet, idx) => {
            if (idx === selfIdx) return;

            let distX = puppet.x - this.x;
            let overlapX = (puppet.hWidth + this.hWidth) - Math.abs(distX);

            // packing distX sign for resolution
            if (overlapX > 0) possibleCollisions.push([idx, overlapX * Math.sign(distX)]);
        });

        // narrow phase
        /* AABB
        stands for 'alligned axis bounding boxes' and is a system where all hitboxes are alligned to one axis
        it only works with rectangles

        broad phase has already checked x-axis overlap, so only the y-axis needs to be checked
        */
        possibleCollisions.forEach(puppet => {
            let distY = BP._home[puppet[0]].y - this.y;
            let overlapY = (BP._home[puppet[0]].hHeight + this.hHeight) - Math.abs(distY);

            // packing distX sign for resolution
            if (overlapY > 0) {
                puppet.push(overlapY * Math.sign(distY));
                this._resolveCollision(puppet);
            }
        });
    }
    _resolveCollision(pInfo) {
        // unpack pInfo for readability
        let i = pInfo[0];
        let ovX = pInfo[1];
        let ovY = pInfo[2];

        if (Math.abs(ovX) < Math.abs(ovY)) {
            let move = ovX / (2 * BP.Config.collision.substeps);

            this.x -= move;
            BP._home[i].x += move;
            
            // so long lol
            // old: // += -BP._home[i].vect.x / BP.Config.collision.substeps;
            if (this.collisionRebound && Math.abs(ovX) < BP.Config.collision.rbBuffer) this._invertVect('x');
            if (BP._home[i].collisionRebound && Math.abs(ovX) < BP.Config.collision.rbBuffer) BP._home[i]._invertVect('x');
        } else {
            let move = ovY / (2 * BP.Config.collision.substeps);

            this.y -= move;
            BP._home[i].y += move;

            // old:  // += -BP._home[i].vect.y / BP.Config.collision.substeps;
            if (this.collisionRebound && Math.abs(ovY) < BP.Config.collision.rbBuffer) this._invertVect('y');
            if (BP._home[i].collisionRebound && Math.abs(ovY) < BP.Config.collision.rbBuffer) BP._home[i]._invertVect('y');
        }
    }
    /**
     * Calculate Puppet's movement and collision  
     * @returns {void}
     */
    _update() {
        this._move();
        if (this.collidable) {
            this._playgroundCollisionDetection();
            this._ptpCollisionDetection();
        };
    }
    /**
     * Draw Puppet to Canvas
     * @returns {void}
     */
    _draw() {
        // todo = look into drawing sprites
        BP.ctx.beginPath();
        BP.ctx.fillStyle = this.color;
        BP.ctx.fillRect(
            this.x - this.hWidth,
            this.y - this.hHeight,
            this.width,
            this.height
        );
    }
    /**
     * Sets Paintbrush that will be used for all puppets. 
     * @param {Paintbrush} paintbrush
     * @returns {void}
     */
    static SetPaintbrush(paintbrush) {
        // expects a PaintBrush object
        this.paintbrush = paintbrush;
        this.ctx = paintbrush.ctx;
    }
    static _resizePlayground() {
        this.Playground = [
            {
                x: 0 + this.Config.playground.margin.left,
                y: 0 + this.Config.playground.margin.top
            },
            {
                x: this.paintbrush.width - this.Config.playground.margin.right,
                y: this.paintbrush.height - this.Config.playground.margin.bottom
            }
        ];
    }
    /**
     * Resizes Playground to Paintbrush's dimensions.
     * @param {Number} playgroundmargin
     * - default: 0
     * - Advanced: Object with the following properties:
     *      - top
     *      - bottom
     *      - left
     *      - right
     * @param {Boolean} autoResize=true
     * @returns {void}
     */
    static SetPlayground(playgroundmargin = 0, autoResize = true) {
        this.Config.playground.margin = (typeof(playgroundmargin) !== 'number') ? 
            playgroundmargin: 
            {
                top: playgroundmargin,
                bottom: playgroundmargin,
                left: playgroundmargin,
                right: playgroundmargin
            };
        
        this._resizePlayground(); // initial resize
        if (autoResize) $(window).resize(() => {this._resizePlayground()});
    }
    /**
     * Draws all puppets to Paintbrush
     * @returns {void}
     */
    static DrawAll() {
        this._home.forEach(puppet => {
            puppet._draw();
        });

        if (this.Config.playground.debug) {
            this.ctx.strokeStyle = 'rgb(255, 255, 255)';
            this.ctx.beginPath();
            this.ctx.moveTo(this.Playground[0].x, this.Playground[0].y);
            this.ctx.lineTo(this.Playground[0].x, this.Playground[1].y);
            this.ctx.lineTo(this.Playground[1].x, this.Playground[1].y);
            this.ctx.lineTo(this.Playground[1].x, this.Playground[0].y);
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.beginPath()
            let point = this.PGCenter;
            BP.ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    /**
     * Updates all puppet's position and collision.
     * @returns {void}
     */
    static UpdateAll() {
        this._home.forEach(puppet => {
            puppet._update();
        });
    }

    get hWidth() {return this.width / 2};
    get hHeight() {return this.height / 2};
    static get PGCenter() {
        return {
            x: ((this.Playground[1].x - this.Playground[0].x) / 2) + (this.Config.playground.margin.left),
            y: ((this.Playground[1].y - this.Playground[0].y) / 2) + (this.Config.playground.margin.top)
        };
    };
    // get points() {
    //     return [
    //         [this.x - this.hWidth, this.y - this.hHeight],
    //         [this.x + this.hWidth, this.y - this.hHeight],
    //         [this.x - this.hWidth, this.y + this.hHeight],
    //         [this.x + this.hWidth, this.y + this.hHeight]
    //     ];
    // }
}