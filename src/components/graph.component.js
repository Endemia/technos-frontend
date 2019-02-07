import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import joint from 'jointjs/index';
import Test from '../jointjs-configuration/Test';

@observer
class Graph extends React.Component {

	constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph();
        this.nodeMap = {};

        joint.layout.DirectedGraph.layout(this.graph);
    }

    componentDidMount() {

        this.paper = new joint.dia.Paper({
            el: ReactDOM.findDOMNode(this.refs.placeholder),
            width: "100%",
            height: 700,
            background: { color: '#eeeeee'},
            model: this.graph
        });

    }

	addNode(tech) {

        const techRect = new Test(100, 100, tech, 0).getShape();
        techRect.addTo(this.graph);

        this.nodeMap[tech]=techRect.id;
    }

    addLink(link) {
        if (link.from && link.to) {
            const sourceId = this.nodeMap[link.from];

            link.to.forEach(l => {
                const destId = this.nodeMap[l];

                const arrow = new joint.shapes.standard.Link({
                    source: { id: sourceId },
                    target: { id: destId },
                    attrs: {
                        '.connection': {
                            'fill': 'none',
                            'stroke-linejoin': 'round',
                            'stroke-width': '2',
                            'stroke': '#4b4a67'
                        }
                    }
                });

                arrow.addTo(this.graph);
            });
        }
    }

    clear() {
        Object.keys(this.nodeMap).forEach(key => {
            const cell = this.graph.getCell(this.nodeMap[key]);
            if (cell) {
                cell.remove();
            }
        });
        this.nodeMap = {};
    }

    render() {
        this.clear();
        
        this.props.technos.nodes.forEach((node) => {
            this.addNode(node);
        });
        this.props.technos.links.forEach((link) => {
            this.addLink(link);
        });

        joint.layout.DirectedGraph.layout(this.graph, { marginX: 50, marginY: 50 });

        return (
            <div className="graph">
                <div id="playground" ref="placeholder">
                </div>
            </div>
        )
    }
}

export default Graph;