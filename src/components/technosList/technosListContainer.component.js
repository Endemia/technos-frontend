import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import TechnosList from './technosList.component';

const styles = theme => ({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 46,
		bottom: 0,
		overflowY: 'auto',
		overflowX: 'hidden',
		scrollbarColor: '#e62b2b #2e3441',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar-button': {
            display: 'none',
            height: 0,
            borderRadius: 0,
            backgroundColor: '#AAA'
        },
        '&::-webkit-scrollbar-button:hover': {
            backgroundColor: '#AAA'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c62828',
            borderRadius: 4
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#e62b2b'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#2e3441',
            borderRadius: 4
        },
        '&::-webkit-scrollbar-track:hover': {
            backgroundColor: '#2e3441',
            borderRadius: 4
        },
        '&::-webkit-scrollbar': {
            width: 8
        },
	}
})

@inject("notesStore")
@observer
class TechnosListContainer extends React.Component {

	getAllNotes = () => {
        this.props.notesStore.getAllNotes();
    }

	render() {
		this.getAllNotes();
		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<TechnosList notes={this.props.notesStore.allNotes}></TechnosList>
			</div>
		)
	}

}

export default withStyles(styles)(TechnosListContainer);