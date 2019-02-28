import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import AuthenticationApi from '../../api/AuthenticationApi';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
	register: {
	    ...theme.mixins.gutters(),
	    paddingTop: theme.spacing.unit * 2,
	    paddingBottom: theme.spacing.unit * 2,
	    width: 600,
	    backgroundColor: "rgba(255, 255, 255, .6)",
	},
	container: {
		position: "absolute",
    	left: 0,
    	right: 0,
    	top: 0,
    	bottom: 0,
    	display: "flex",
    	justifyContent: "center",
    	alignItems: "center",
	},
	icon: {
		fontSize: 40,
		color: "#ffffff"
	},
	title: {
		display: "flex",
		color: "#ffffff"
	},
});

class Activate extends React.Component {

	state = {
		activating: true,
	}

	activate = () => {

		if (this.props.match.params && this.props.match.params.registerKey && this.props.match.params.login) {
			const login = this.props.match.params.login;
			const registerKey = this.props.match.params.registerKey;
			new AuthenticationApi().activate(login, registerKey).then(res => {
				this.setState({activating : false});
			})
		}
	}

	componentDidMount() {
		this.activate();
	}

	render() {

		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<Paper className={classes.register} elevation={1}>
					<div className={classes.title}>
						<PersonIcon className={classes.icon} />
						<Typography variant="h4" gutterBottom className={classes.title}>Register</Typography>
					</div>
					
					<div>
						{this.state.activating ?
							<Typography variant="h6">
								Activation du compte <CircularProgress className={classes.progress} size={20} />
							</Typography>
						:
							<Typography variant="h6">
								Compte activé. Vous pouvez maintenant vous connecter.
							</Typography>						
						}
					</div>
				</Paper>
			</div>
		)
	}
}

export default withStyles(styles)(Activate);