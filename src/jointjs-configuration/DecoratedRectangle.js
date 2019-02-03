import joint from 'jointjs/index';

joint.shapes.basic.DecoratedRect = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',
    defaults: joint.util.deepSupplement({
        type: 'basic.DecoratedRect',
        size: { width: 100, height: 60 },
        attrs: {
            rect: { fill: '#00A878', stroke: '#0B0500', strokeWidth: 1, rx: 10, ry: 10 },
            text: { 'font-size': 18, 'font-variant': 'small-caps', 'font-family': 'Arial', text: '', 'ref-x': .5, 'ref-y': .2, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle', fill: 'black' },
            image: { 'ref-x': 12, 'ref-y': 32, ref: 'rect', width: 60 }
        }

    }, joint.shapes.basic.Generic.prototype.defaults)
});

class DecoratedRectangle {

  	constructor(x, y, label) {
    	this.x = x;
    	this.y = y;
    	this.label = label;
        this.w = label.length * 10 + 30;
  	}

	getShape() {
        var decoratedRect = new joint.shapes.basic.DecoratedRect({
            position: { x: this.x, y: this.y },
            size: { width: this.w, height: 60 },
            attrs: {
                rect: { width: this.w, height: 60},
                text: { text: this.label },
                image: { 'xlink:href': 'http://localhost:3000/img/etoiles.jpg', 'ref-x': this.w/2 - 30 }
            }
        });

        return decoratedRect;
	}
}

export default DecoratedRectangle;