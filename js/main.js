import { Paintbrush } from "./Paintbrush.js";
import { BasePuppet } from "./Puppet/BasePuppet.js";
import { PlayerPuppet } from "./Puppet/PlayerPuppet.js";
import { Shovel } from "./util/Shovel.js"
import { RNG } from "./util/RNG.js";

// change title
switch(window.location.protocol) {
    case 'https:':
        document.title += " (GitHub)";
        break;
    case 'http:':
    case 'file:':
        document.title += " (Local)";
        break;
    default:
        document.title += " (???)";
}

// canvas setup
let disp = new Paintbrush('#disp', '#disp-container', 'black');
disp.EnableAutoResize();

// Puppet setup
BasePuppet.SetPaintbrush(disp);
BasePuppet.SetPlayground({
    top: 20,
    bottom: 20,
    left: 75,
    right: 75
});
BasePuppet.Config.playground.debug = true;
let center = BasePuppet.PGCenter; // used for spawn coords

// other
let _deb = $('#debug'); 

// puppets
const player = new PlayerPuppet(
    center.x,
    center.y,
    {x: 0, y: 0},
    3,
    {
        width: 15,
        height: 15,
        color: 'rgb(100, 255, 50)'
    }
)
const pDeb = new Shovel(
    player,
    [
        'speed',
        'width',
        'height',
        'color',
        'zDepth',
        'cheats',
        'collisionRebound',
        '_movementStep',
        'active',
        'inactive',
        'key'
    ],
    true
);

const bots = [];
for (let i = 0; i < 50; i++) {
    bots.push(new BasePuppet(
        center.x + RNG.randFloat(-40, 40),
        center.y + RNG.randFloat(-40, 40),
        {
            x: RNG.randFloat(-1, 1),
            y: RNG.randFloat(-1, 1)
        },
        RNG.randInt(2, 6),
        {
            width: 10,
            height: 10,
            color: `hsl(${RNG.randInt(0, 360)}, 100%, 50%)`
        }
    ));
}

// init
$(document).ready(() => {
    let ticks, frames; // for intervals
    let tps = 60; // using minecraft as reference for this
    let fps = 60;

    ticks = setInterval(() => {
        BasePuppet.UpdateAll();
        player.ActionHandler();

        // debugging
        _deb.html(pDeb.ListObjectProperties('<br>'));
    }, 1000 / tps);

    frames = setInterval(() => {
        disp.Clear();
        BasePuppet.DrawAll();

        // you'll never guess what it is :o
        player._debugUtil(['xyActual','pinpoint']);
    }, 1000 / fps);

});