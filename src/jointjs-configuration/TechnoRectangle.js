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
                '<div class="centerOn">&nbsp;</div>',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());

            this.$box.find('.star1').on('mousedown', e => {
                if (this.model.get('note') === 1) {
                    this.model.set('note', 0);
                    this.model.get('onUpdateNote')(this.model.get('label'), 0);
                } else {
                    this.model.set('note', 1);
                    this.model.get('onUpdateNote')(this.model.get('label'), 1);
                }
                this.updateBox();
                e.stopPropagation();
            });
            this.$box.find('.star2').on('mousedown', e => {
                if (this.model.get('note') === 2) {
                    this.model.set('note', 0);
                    this.model.get('onUpdateNote')(this.model.get('label'), 0);
                } else {
                    this.model.set('note', 2);
                    this.model.get('onUpdateNote')(this.model.get('label'), 2);
                }
                this.updateBox();
                e.stopPropagation();
            });
            this.$box.find('.centerOn').on('mousedown', e => {
                this.model.get('onCenter')(this.model.get('label'));
                e.stopPropagation();
            });

            this.model.on('change', this.updateBox, this);
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
            var bbox = this.model.getBBox();
            this.$box.find('label').text(this.model.get('label'));
            this.$box.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
            });
            if (this.model.get('focus')) {
                this.$box.addClass('focus');
            }

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


class TechnoRectangle {

    constructor(x, y, label, note, focus, onUpdateNote, onCenter) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.note = note;
        this.focus = focus;
        this.onUpdateNote = onUpdateNote;
        this.onCenter = onCenter;
        this.w = label.length * 10 + 30;
    }

    getShape() {
        var decoratedRect = new joint.shapes.html.Element({
            position: { x: this.x, y: this.y },
            size: { width: this.w, height: 60 },
            label: this.label,
            note: this.note,
            focus: this.focus,
            onUpdateNote: this.onUpdateNote,
            onCenter: this.onCenter,
        });

        return decoratedRect;
    }
}

export default TechnoRectangle;