import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
	card: {
		width: 200,
		flexGrow: 0,
		margin: 5,
		backgroundColor: 'rgba(255, 255, 255, .8)',
		position: 'relative'
	},
	cardContent: {
		padding: '5px 0 5px 0 !important',
	},
	technoName: {
		fontWeight: 'bold',
	},
	centerOn: {
		pointerEvents: 'auto',
	    cursor: 'pointer',
	    position: 'absolute',
	    top: 0,
	    right: 0,
	    width:20,
	    height:20,
	    background: 'url(../img/centerOn.png) no-repeat',

	    '&:hover': {
	    	background: 'url(../img/centerOnActive.png) no-repeat' 
	    }
	},
});

@inject("notesStore", "searchStore", "technosStore")
@observer
class TechnoCard extends React.Component {

	updateNote = (e, techno, fromNote, toNote) => {
		e.stopPropagation();
		if (fromNote === toNote) {
			toNote = 0;
		}
		this.props.notesStore.updateUserNote(techno, toNote);
	}

	goToTechno = (technoName) => {
        this.props.searchStore.setQuery(technoName);
        this.props.searchStore.setExactQuery(true);
        this.props.technosStore.centerOn(technoName, true);
    }

	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.card} key={this.props.note.techno}>
				<Typography color="textSecondary" gutterBottom>
		          	<span className={classes.technoName} >
		          		{this.props.note.techno}
	          		</span>
	          	</Typography>
	          	<div className={classes.centerOn} onClick={e => this.goToTechno(this.props.note.techno)}>&nbsp;</div>
	          	<div className="stars_container">
	          		<div className="stars" >
	          			<div className={this.props.note.note > 0 ? 'star1 active' : 'star1'} onClick={e => this.updateNote(e, this.props.note.techno, this.props.note.note, 1)}>
		          			<div className={this.props.note.note > 1 ? 'star2 active' : 'star2'} onClick={e => this.updateNote(e, this.props.note.techno, this.props.note.note, 2)}>
		          			</div>
	          			</div>
			        </div>
		        </div>
			</Paper>
		);
	}
}

export default withStyles(styles)(TechnoCard);