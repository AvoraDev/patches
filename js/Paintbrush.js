export class Paintbrush {
    constructor(canvasID, containerID, clearColor, widthRatio = 16, heightRatio = 9) {
        this._c = document.querySelector(canvasID);
        this._containerID = containerID;
        this._clearColor = clearColor;
        this._dispRatio = {
            width: widthRatio,
            height: heightRatio
        };
        this.ctx = this._c.getContext('2d');
    }
    Clear() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this._clearColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    Resize() {
        // get container
        let container = $(this._containerID);

        // calculated dimensions
        let tallWidth = (container.innerHeight() * this._dispRatio.width) / this._dispRatio.height;
        let wideHeight = (container.innerWidth() * this._dispRatio.height) / this._dispRatio.width;

        // check to make sure calculated dimension isn't larger than the containers dimension
        if (container.innerWidth() > container.innerHeight() && tallWidth < container.innerWidth()) {
            this.width = tallWidth;
            this.height = container.innerHeight();
        } else {
            this.width = container.innerWidth();
            this.height = wideHeight;
        }
    }
    EnableAutoResize() {
        // initial resize
        this.Resize();

        $(window).resize(() => { 
            this.Resize();
        });
    }
    
    get width() {return this._c.width};
    set width(w) {this._c.width = w;}
    get height() {return this._c.height};
    set height(h) {this._c.height = h;}
}
