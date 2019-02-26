import React from 'react';
import { observer, inject } from 'mobx-react';

import Graph from './graph.component';
import SearchBox from './searchBox.component';

@inject("technosStore", "notesStore")
@observer
class GraphContainer extends React.Component {

    getNodes= () => {
        this.props.technosStore.getTechnos();
    }

    getUserNotes= () => {
        this.props.notesStore.getUserNotes();
    }

	render() {

		this.getNodes();
		this.getUserNotes();

		return (
			<div className="graphContainer">
				<SearchBox></SearchBox>
				<Graph technos={this.props.technosStore.technos} notes={this.props.notesStore.userNotes}></Graph>
			</div>
		)
	}
}

export default GraphContainer;