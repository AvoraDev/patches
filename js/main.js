import { Paintbrush } from "./Puppet/Paintbrush.js";
import { BasePuppet } from "./Puppet/BasePuppet.js";
import { PlayerPuppet } from "./Puppet/PlayerPuppet.js";
import { CombatSetup, AddDefaultMelee} from "./Puppet/optional/combat.js";
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
CombatSetup();
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
player.ImplementCombat(100, 100, 100, 100, 100);
AddDefaultMelee(player, 'KeyJ', 1.2);

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

// debugging
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
        'secondaryGraphics',
        '_movementStep',
        'active',
        'inactive',
        'key',
        'disabledDuration'
    ],
    true
);
pDeb.formatFunc.number = (item) => {
    if (!Number.isInteger(item)) return Math.round(item * 100) / 100;

    switch(item) {
        case PlayerPuppet.AS.Disabled:
            return '<span style="color: magenta">Disabled</span>';
        case PlayerPuppet.AS.Off:
            return '<span style="color: red">Off</span>';
        case PlayerPuppet.AS.Inactive:
            return '<span style="color: yellow">Inactive</span>';
        case PlayerPuppet.AS.Active:
            return '<span style="color: lightgreen">Active</span>';
        default:
            return item;
    }
};
pDeb.formatFunc.boolean = (item) => {
    if (item) return    '<span style="color: cyan">true</span>';
    else return         '<span style="color: orange">false</span>'
}

let ticks, frames; // for intervals
let fps = 60;
let tps = 60
function calcTick() {
    BasePuppet.UpdateAll();
    player.ActionHandler();

    // debugging
    _deb.html(pDeb.ListObjectProperties('<br>'));
}
function drawFrame() {
    disp.Clear();
    BasePuppet.DrawAll();

    // you'll never guess what it is :o
    player.Debug('rgb(255, 255, 255)', 'xyActual', 'pinpoint');
}
function initAll() {
    // clear previous intervals
    clearInterval(ticks);
    clearInterval(frames);

    // create intervals
    ticks = setInterval(() => {calcTick()}, 1000 / tps);
    frames = setInterval(() => {drawFrame()}, 1000 / fps);

    // log
    console.log(`Initialiezd @ ${fps} FPS / ${tps} TPS`)
}

// debug inputs & buttons
$('#fps-set').keydown(e => {
    if (e.code !== 'Enter') return;

    fps = $('#fps-set').val();
    initAll();
});

$('#tps-set').keydown(e => {
    if (e.code !== 'Enter') return;

    tps = $('#tps-set').val();
    initAll();
});
$('#pause').click(() => {
    if ($('#pause').html() === 'Pause') {
        $('#pause').html('Play');
        $('#step').attr('disabled', false);

        clearInterval(ticks);
        clearInterval(frames);
    } else {
        $('#pause').html('Pause');
        $('#step').attr('disabled', true);

        initAll();
    }
});
$('#step').click(() => {
    calcTick();
    drawFrame();
});

// first init
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

$(document).ready(() => {initAll()});

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-