import joint from 'jointjs/index';
import _ from 'underscore';
import $ from 'jquery';

    joint.shapes.html = {};
    joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
        defaults: joint.util.deepSupplement({
            type: 'html.Element',
            attrs: {
                rect: { stroke: 'none', 'fill-opacity': 0 }
            }
        }, joint.shapes.basic.Rect.prototype.defaults)
    });

// Create a custom view for that element that displays an HTML div above it.
// -------------------------------------------------------------------------

    joint.shapes.html.ElementView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            '<label></label>',
            '<div class="stars_container">',
            '<div class="stars" >',
            '<div class="star1" >',
            '<div class="star2" >',
            '</div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());

            
            
            this.$box.find('.star1').on('mousedown click', e => {
                this.model.set('note', 1);
                this.updateBox();
                e.stopPropagation();
            });
            this.$box.find('.star2').on('mousedown click', e => {
                this.model.set('note', 2);
                this.updateBox();
                e.stopPropagation();
            });


            // Update the box position whenever the underlying model changes.
            this.model.on('change', this.updateBox, this);
            // Remove the box when the model gets removed from the graph.
            this.model.on('remove', this.removeBox, this);

            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);
            this.updateBox();
            return this;
        },
        updateBox: function() {
            // Set the position and dimension of the box so that it covers the JointJS element.
            var bbox = this.model.getBBox();
            // Example of updating the HTML with a data stored in the cell model.
            this.$box.find('label').text(this.model.get('label'));
            this.$box.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
            });

            if (this.model.get('note') > 0) {
                this.$box.find('.star1').addClass('active');
            } else {
                this.$box.find('.star1').removeClass('active');
            }
            if (this.model.get('note') > 1) {
                this.$box.find('.star2').addClass('active');
            } else {
                this.$box.find('.star2').removeClass('active');
            }
            
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });


class Test {

    constructor(x, y, label, note) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.note = note;
        this.w = label.length * 10 + 30;
    }

    getShape() {
        var decoratedRect = new joint.shapes.html.Element({
            position: { x: this.x, y: this.y },
            size: { width: this.w, height: 60 },
            label: this.label,
            note: this.note
        });

        return decoratedRect;
    }
}

export default Test;