import joint from 'jointjs/index';

class Rectangle {

  	constructor(x, y, w, label) {
    	this.x = x;
    	this.y = y;
    	this.w = w;
    	this.label = label;
  	}

	getShape() {
		var rect2 = new joint.shapes.standard.Rectangle();
        rect2.position(this.x, this.y);
        rect2.resize(this.label.length * 15 + 30, 50);
        rect2.attr({
            body: {
                fill: '#00A878',
                rx: 10,
                ry: 10,
                strokeWidth: 1,
                stroke: '#0B0500'
            },
            label: {
                text: this.label,
                fill: '#0B0500',
                fontSize: 18,
                fontVariant: 'small-caps',
                fontFamily: 'Arial'
            }
        });
        return rect2;
	}
}

export default Rectangle;