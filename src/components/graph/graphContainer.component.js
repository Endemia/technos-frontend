import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import Graph from './graph.component';
import SearchBox from './searchBox.component';
import UserTechnosList from '../technosList/userTechnosList.component';

const styles = {
	container: {
		display: "flex",
		width: '100%',
	},
	userTechnosList: {
		width: '100%',
	}
};

@inject("technosStore", "notesStore")
@observer
class GraphContainer extends React.Component {

    getNodes= () => {
        this.props.technosStore.getTechnos();
    }

    

	render() {

		this.getNodes();
		

		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<div>
					<SearchBox></SearchBox>
					<Graph technos={this.props.technosStore.technos} notes={this.props.notesStore.userNotes}></Graph>
				</div>
				<div className={classes.userTechnosList}>
					<UserTechnosList></UserTechnosList>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(GraphContainer);