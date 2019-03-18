import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = {
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		marginLeft: 10,
		marginTop: 36
	},
	card: {
		width: 200,
		flexGrow: 0,
		margin: 5,
		backgroundColor: 'rgba(255, 255, 255, .8)',
	},
	cardContent: {
		padding: '5px 0 5px 0 !important',
	},
	technoName: {
		fontWeight: 'bold'
	}
};

@inject("notesStore")
@observer
class UserTechnosList extends React.Component {

	updateNote = (e, techno, fromNote, toNote) => {
		e.stopPropagation();
		if (fromNote === toNote) {
			toNote = 0;
		}
		this.props.notesStore.updateUserNote(techno, toNote);
	}

	listeNote = () => {
		return this.props.notesStore.userNotes.filter(note => note.note > 0)
		.sort(function(a,b) {
			var x = a.techno.toLowerCase();
			var y = b.techno.toLowerCase();
			return x < y ? -1 : x > y ? 1 : 0;
		});
	}

	render() {

		const { classes } = this.props;

		return (
			<div className={classes.container}>
				{this.listeNote().map(note => {
					return (
						<Paper className={classes.card} key={note.techno}>
							<Typography color="textSecondary" gutterBottom>
					          	<span className={classes.technoName}>
					          		{note.techno}
				          		</span>
				          	</Typography>
				          	<div className="stars_container">
				          		<div className="stars" >
				          			<div className={note.note > 0 ? 'star1 active' : 'star1'} onClick={e => this.updateNote(e, note.techno, note.note, 1)}>
					          			<div className={note.note > 1 ? 'star2 active' : 'star2'} onClick={e => this.updateNote(e, note.techno, note.note, 2)}>
					          			</div>
				          			</div>
						        </div>
					        </div>
						</Paper>
					)
				})}
			</div>
		)
	}
}

export default withStyles(styles)(UserTechnosList);