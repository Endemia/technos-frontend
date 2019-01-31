import React from 'react';
import ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import joint from 'jointjs/index';
import Rectangle from '../jointjs-configuration/Rectangle'

@inject("technosStore")
@observer
class Graph extends React.Component {

	constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph();
        this.cells=[];
    }


    componentDidMount() {
        this.paper = new joint.dia.Paper({
            el: ReactDOM.findDOMNode(this.refs.placeholder),
            width: 1500,
            height: 700,
            model: this.graph
        });
        this.graph.addCells(this.cells);

        this.props.nodes.forEach(node => {
            const label = node[Object.keys(node)[0]];
            console.log('>>>> ', label);
            this.cells.push(new Rectangle(100,100,200,label).getShape());
        });

    }

	addNode(title) {

        const rect = new Rectangle(100, 100, 200, 'NodeJS').getShape();
        this.cells.push(rect);

    }

    render() {

        return (
            <div id="playground" ref="placeholder">
            </div>
        );
    }
}

export default Graph;