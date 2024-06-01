export class Shovel {
    constructor(obj, blacklist = [], blCheckAllDepths = false) {
        this.obj = obj;
        this.blacklist = blacklist;
        this.blCheckAllDepths = blCheckAllDepths;
        this.keys = this._getAllKeys(this.obj);
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
            if (typeof(value) === 'number') value = value.toFixed(2);

            // add to output
            output += `${key}: ${value} ${breaker}`;
        });
    
        return output;
    }
}
