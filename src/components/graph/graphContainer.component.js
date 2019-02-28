import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import Graph from './graph.component';
import SearchBox from './searchBox.component';
import UserTechnosList from '../technosList/userTechnosList.component';

const styles = {
	container: {
		display: "flex",
	}
};

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

		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<div>
					<SearchBox></SearchBox>
					<Graph technos={this.props.technosStore.technos} notes={this.props.notesStore.userNotes}></Graph>
				</div>
				<div>
					<UserTechnosList></UserTechnosList>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(GraphContainer);