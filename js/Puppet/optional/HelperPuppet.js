import { BasePuppet } from "../BasePuppet.js";
export { HP as HelperPuppet };

class HP extends BasePuppet {
    constructor(puppet, sizeMultiplier = 0.75, offset = {x: 0, y: 0}, followLeader = true) {
        super(
            puppet.x,
            puppet.y,
            {
                x: 0,
                y: 0
            },
            puppet.speed,
            {
                width: puppet.width * sizeMultiplier,
                height: puppet.height * sizeMultiplier,
                color: 'red'
            },
            {
                zDepth: puppet.zDepth + 1,
                collidable: false // ,
                // collisionRebound: false
            }
        );

        // location handling
        this.leader = puppet;
        this.followLeader = followLeader;
        this.offset = offset;

        // logic for hitbox uses
        this._check_ = false;
    }
    _move() {
        // this will replace the default move function
        this.x = this.leader.x + (Math.sign(this.leader.vect.x) * this.offset.x);
        this.y = this.leader.y + (Math.sign(this.leader.vect.y) * this.offset.y);
    }
}