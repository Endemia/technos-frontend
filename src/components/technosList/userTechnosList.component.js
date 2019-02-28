import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		marginLeft: 10
	},
	card: {
		width: 200,
		flexGrow: 0,
		margin: 5,
		backgroundColor: 'rgba(255, 255, 255, .8)',
	},
	cardContent: {
		padding: 0,
	}
};

@inject("notesStore")
@observer
class UserTechnosList extends React.Component {

	render() {

		const { classes } = this.props;

		return (
			<div className={classes.container}>
				{this.props.notesStore.userNotes.filter(note => note.note > 0).map(note => {
					return (
						<Card className={classes.card}>
							<CardContent className={classes.cardContent}>
								<Typography className={classes.title} color="textSecondary" gutterBottom>
						          	{note.techno}
						          	<div class="stars_container">
						          		<div class="stars" >
						          			<div class={note.note > 0 ? 'star1 active' : 'star1'}>
							          			<div class={note.note > 1 ? 'star2 active' : 'star2'}>
							          			</div>
						          			</div>
								        </div>
							        </div>
						        </Typography>
							</CardContent>
						</Card>
					)
				})}
			</div>
		)
	}
}

export default withStyles(styles)(UserTechnosList);