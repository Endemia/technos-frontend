import React from 'react';
import { observer, inject } from 'mobx-react';

import TechnosList from './technosList.component';

@inject("notesStore")
@observer
class TechnosListContainer extends React.Component {

	getAllNotes = () => {
        this.props.notesStore.getAllNotes();
    }

	render() {
		this.getAllNotes();

		return (
			<div>
				<TechnosList notes={this.props.notesStore.allNotes}></TechnosList>
			</div>
		)
	}

}

export default TechnosListContainer;