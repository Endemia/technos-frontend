import React from 'react';
import { observer, inject } from 'mobx-react';

import Graph from './graph.component';
import SearchBox from './searchBox.component';

@inject("technosStore")
@observer
class GraphContainer extends React.Component {

    getNodes() {
        this.props.technosStore.getTechnos();
    }

	render() {

		this.getNodes();

		return (
			<div className="graphContainer">
				<SearchBox></SearchBox>
				<Graph technos={this.props.technosStore.technos}></Graph>
			</div>
		)
	}
}

export default GraphContainer;