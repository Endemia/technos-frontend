import React from 'react';
import { observer, inject } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames/bind';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
	heading: {
	    fontSize: theme.typography.pxToRem(15),
    },
    columnStars: {
	    flexBasis: '5%',
	    paddingTop: '5px',
	},
    columnNames: {
    	display: 'flex',
	    flexBasis: '45%',
	    justifyContent: 'start',
	},
	helper: {
	    borderLeft: `2px solid ${theme.palette.divider}`,
	    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
	},
	chip: {
	    margin: theme.spacing.unit / 2,
	},
	element: {
		backgroundColor: 'rgba(255, 255, 255, .3)',
	},
	details: {
		backgroundColor: '#ececec',
		borderTop: '1px #d0d0d0 solid',
	},
	detailsActive: {
		backgroundColor: '#d0d0d0',
		fontWeight: 'bold',
		fontFamily: "Roboto, Helvetica, Arial, sans-serif",
	},
	detailsInactive: {
		backgroundColor: 'rgba(255, 255, 255, .6)',
		fontFamily: "Roboto, Helvetica, Arial, sans-serif",
	}
})

@inject("notesStore")
@observer
class TechnosList extends React.Component {

	state = {
    	expanded: null,
  	};

  	handleChange = panel => (event, expanded) => {
	    this.setState({
	        expanded: expanded ? panel : false,
	    });
	};

	render() {
		const { classes } = this.props;

		return (
			<div>
				{this.props.notes.map(techno => {
	      			return (
	      				<ExpansionPanel key={techno.techno} expanded={this.state.expanded === techno.techno} onChange={this.handleChange(techno.techno)} className={classes.element}>
		        			<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={this.state.expanded === techno.techno ? classes.detailsActive : classes.detailsInactive}>
		          				<div>
		            				{techno.techno}
		          				</div>
		        			</ExpansionPanelSummary>
		        			<ExpansionPanelDetails className={classes.details}>
	          					<div className={classes.columnStars}>
	            					<img src="img/active_star.png" alt="1 stars"/>
	          					</div>
	          					<div className={classes.columnNames}>
	          						{techno.notes && techno.notes.filter(note => note.note === 1).map(note => {
	          							return (
	          								<div key={note.user.userId}>
	          									<Chip label={note.user.prenom + " " + note.user.nom} className={classes.chip} color="secondary"/>
	          								</div>
          								)
          							})}
	          					</div>
	          					<div className={classNames(classes.columnStars, classes.helper)}>
	            					<img src="img/active_star.png" alt="2 stars"/><img src="img/active_star.png" alt="2 stars"/>
	          					</div>
	          					<div className={classes.columnNames}>
	          						{techno.notes && techno.notes.filter(note => note.note === 2).map(note => {
	          							return (
	          								<div key={note.user.userId}>
	          									<Chip label={note.user.prenom + " " + note.user.nom} className={classes.chip} color="secondary"/>
	          								</div>
          								)
          							})}
	          					</div>
		        			</ExpansionPanelDetails>
		        		</ExpansionPanel>
		        	)
	        	})}
			</div>
		)
	}

}

export default withStyles(styles)(TechnosList);