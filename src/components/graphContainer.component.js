import React from 'react';
import ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import Graph from './graph.component';

@inject("technosStore")
@observer
class GraphContainer extends React.Component {

	constructor(props) {
        super(props);
    }

    getNodes() {
        this.props.technosStore.getTechnos();
    }

    render() {
        
        this.getNodes();

        return (
            <Graph nodes={this.props.technosStore.technos}>
            </Graph>);
    }

}

export default GraphContainer;