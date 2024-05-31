import { Paintbrush } from "./Paintbrush.js";
import { BasePuppet } from "./Puppet/BasePuppet.js";
import { PlayerPuppet } from "./Puppet/PlayerPuppet.js";

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

// util functions
function randInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function randFloat(min, max) { // min and max included 
    return Math.random() * (max - min + 1) + min;
}
/**
 * Returns list of all keys including nested properties. Nested properties are placed in another array.
 * @param {Object} obj
 * @param {Array} ignore=[]
 * @param {Boolean} ignoreFullDepth=false
 * @returns {Array}
 */
function returnAllKeys(obj, ignore = [], ignoreFullDepth = false) {
    let out = [];

    Object.keys(obj).forEach(key => {
        if (ignore.indexOf(key) !== -1) return;

        if (typeof(obj[key]) !== 'object') out.push(key);
        else {
            out.push(key);
            out.push(returnAllKeys(
                obj[key],
                (ignoreFullDepth) ? ignore : [],
                ignoreFullDepth
            ));
        }
    });

    return out;
}
function autoDebug(obj, keys, depth = 0) {
    for (let i = 0; i < keys.length; i++) {
        // contents will already be shown
        if (typeof(keys[i]) === 'object') continue;

        // leading thing
        let leading = '';
        for (let j = 0; j < depth; j++) {
            if (j % 2 === 0)    leading += '- ';
            else                leading += '+ ';
        }

        if (typeof(keys[i + 1]) !== 'object') {
            let val = (typeof(obj[keys[i]]) === 'number') ? obj[keys[i]].toFixed(2) : obj[keys[i]];
            _deb.append(`${leading}${keys[i]}: ${val}<br>`);
        } else {
            // nested object
            _deb.append(`${leading}${keys[i]}<br>`);

            // object properties
            autoDebug(obj[keys[i]], keys[i + 1], depth + 1);

            // for readabillity
            _deb.append('<br>');
        }
    }
}

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
const pKeys = returnAllKeys(
    player,
    ['speed', 'width', 'height', 'color', 'zDepth', 'cheats', 'collisionRebound', '_movementStep', 'active', 'inactive', 'key'],
    true
);

const bots = [];
for (let i = 0; i < 50; i++) {
    bots.push(new BasePuppet(
        center.x + randFloat(-40, 40),
        center.y + randFloat(-40, 40),
        {
            x: randFloat(-1, 1),
            y: randFloat(-1, 1)
        },
        randInt(2, 6),
        {
            width: 10,
            height: 10,
            color: `hsl(${randInt(0, 360)}, 100%, 50%)`
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
        _deb.html('');
        autoDebug(player, pKeys);
    }, 1000 / tps);

    frames = setInterval(() => {
        disp.Clear();
        BasePuppet.DrawAll();

        // you'll never guess what it is :o
        player._debugUtil(['xyActual','pinpoint']);
    }, 1000 / fps);

});