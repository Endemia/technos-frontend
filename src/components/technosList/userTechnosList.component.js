import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import TechnoCard from './technoCard.component';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortIcon from '@material-ui/icons/Sort';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		marginLeft: 10
	},
	titleContainer: {
		display: 'flex',
		justifyContent: 'space-around'
	},
	title: {
		color: '#ffffff',
		height: 26
	},
	starTitle: {
		display: 'flex',
		justifyContent: 'center',
		paddingTop: 15
	},
	sortButton: {
		padding: '5px 0',
		color: '#ffffff',
		minWidth: 30,
	},
	sortActive: {
		color: theme.palette.secondary.main
	},
	helpContainer: {
		display: 'flex',
		marginTop: 70,
		justifyContent: 'center',
	},
	help: {
		color: "rgba(255, 255, 255, .4)",
		width: '70%',
	},
	helpLine: {
		display: 'flex',
		justifyContent: 'center',
	}
});

@inject("notesStore", "searchStore", "technosStore")
@observer
class UserTechnosList extends React.Component {

	state = {
		tri: "alpha"
	}

    setTri = (tri) => {
    	this.setState({tri})
    }

    getNotesAlphaSorted = () => {
    	const { classes } = this.props;

    	return (
    		<div className={classes.container}>
    		{this.props.notesStore.userNotes.filter(note => note.note > 0).sort(this.compareAlpha).map(note=> {
	    		return (
					<TechnoCard note={note} key={note.techno}></TechnoCard>
				)
			})}
    		</div>
    	)
    }

    getNotesEvalSorted = () => {
    	const { classes } = this.props;

    	const oneStar = this.props.notesStore.userNotes.filter(note => note.note === 1).sort(this.compareAlpha);
    	const twoStars = this.props.notesStore.userNotes.filter(note => note.note === 2).sort(this.compareAlpha);

		return (
			<div>
				{oneStar.length > 0 &&
					<div>
						<div className={classes.starTitle}>
							<div className={'star1 active'}></div>
						</div>
						<div className={classes.container}>
						{oneStar.length > 0 && oneStar.map(note => 
							<TechnoCard note={note} key={note.techno}></TechnoCard>
						)}
						</div>
					</div>
				}
				{twoStars.length > 0 &&
					<div>
						<div className={classes.starTitle}>
							<div className={'star1 active'}></div><div className={'star1 active'}></div>
						</div>
						<div className={classes.container}>
							{twoStars.map(note => 
								<TechnoCard note={note} key={note.techno}></TechnoCard>
							)}
						</div>
					</div>
				}
			</div>
		)
    }

    compareAlpha = (a, b) => {
		var x = a.techno.toLowerCase();
		var y = b.techno.toLowerCase();
		return x < y ? -1 : x > y ? 1 : 0;
    }

	render() {

		const { classes } = this.props;

		return (
			<div>
				<div className={classes.titleContainer}>
					<div></div>
					<Typography variant="h6" gutterBottom className={classes.title}>Mes évaluations</Typography>
					<div>
						<Button size="small" className={classes.sortButton} onClick={e => this.setTri('alpha')}><SortByAlphaIcon className={this.state.tri === 'alpha' ? classes.sortActive : ''}></SortByAlphaIcon></Button>
						<Button size="small" className={classes.sortButton} onClick={e => this.setTri('eval')}><SortIcon className={this.state.tri === 'eval' ? classes.sortActive : ''}></SortIcon></Button>
					</div>
				</div>
				{(this.props.notesStore.userNotes.length === 0 || this.props.notesStore.userNotes.filter(note => note.note > 0).length === 0) &&
					<div className={classes.helpContainer}>
						<div  className={classes.help}>
							Pour ajouter vos évaluations, cherchez des technos dans la barre de recherche a gauche (exemple: 'Java', 'Devops' ...) et utilisez les étoiles pour vous évaluer.<br/>
							<div className={classes.helpLine}><img src="img/active_star.png" style={{marginLeft:44}} alt="1 étoile" />&nbsp;= "Je connais un peu"</div>
							<div className={classes.helpLine}><img src="img/active_star.png" alt="2 étoiles"/><img src="img/active_star.png" alt="2 étoiles"/>&nbsp;= "Je connais bien"</div>
							<br/><br/>
							<div className={classes.helpLine}><img src="img/centerOn.png" alt="centrer sur"/>&nbsp;permet de center le graph sur la techno correspondante.</div>
						</div>
					</div>
				}
				{this.state.tri === "alpha" && 
					this.getNotesAlphaSorted()
				}
				{this.state.tri === "eval" && 
					this.getNotesEvalSorted()
				}
			</div>
		)
	}
}

export default withStyles(styles)(UserTechnosList);