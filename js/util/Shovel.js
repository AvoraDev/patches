export class Shovel {
    constructor(obj, blacklist = [], blCheckAllDepths = false) {
        this.obj = obj;
        this.blacklist = blacklist;
        this.blCheckAllDepths = blCheckAllDepths;
        this.keys = this._getAllKeys(this.obj);
        this.formatFunc = {
            number(item)    {return Math.round(item * 100) / 100;},
            string(item)    {return item;},
            symbol(item)    {return item;},
            boolean(item)   {return item;},
            function(item)  {return 'func';},
            undefined(item) {return item;}
        };
    }
    _getAllKeys(obj, depth = 0) {
        let output = [];
        
        Object.keys(obj).forEach(key => {
            // skip if key matches any blacklisted keys
            // default is to only check first depth
            if ((depth === 0 || this.blCheckAllDepths) && this.blacklist.indexOf(key) !== -1) return;

            if (typeof(obj[key]) === 'object') {
                // loop through all depths of a nested object to get all keys
                this._getAllKeys(obj[key], depth + 1).forEach(nestedKey => {
                    output.push(`${key}.${nestedKey}`);
                });
            }
            else output.push(key);
        });

        return output;
    }
    _getNestedProperty(obj, path) {
        if (path.length > 1) return this._getNestedProperty(obj[path[0]], path.slice(1));

        else return obj[path[0]];
    }
    ListObjectProperties(breaker = '\n') {
        let output = '';
    
        this.keys.forEach(key => {
            // get value
            let value;
            if (key.indexOf('.') !== -1) value = this._getNestedProperty(this.obj, key.split('.'));
            
            else value = this.obj[key];

            // format it
            switch (typeof(value)) {
                // case 'bigint':
                case 'number':
                    value = this.formatFunc.number(value);
                    break;
                case 'string':
                    value = this.formatFunc.string(value);
                    break;
                case 'symbol':
                    value = this.formatFunc.symbol(value);
                    break;
                case 'boolean':
                    value = this.formatFunc.boolean(value);
                    break;
                case 'function':
                    value = this.formatFunc.function(value);
                    break;
                case 'undefined':
                    value = this.formatFunc.undefined(value);
                    break;
                default:
                    break;
            }

            // add to output
            output += `${key}: ${value} ${breaker}`;
        });
    
        return output;
    }
}
