import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import jwt_decode from 'jwt-decode';

import AuthenticationApi from '../../api/AuthenticationApi';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	login: {
	    ...theme.mixins.gutters(),
	    paddingTop: theme.spacing.unit * 2,
	    paddingBottom: theme.spacing.unit * 2,
	    width: 400,
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
	root: {
	    padding: '4px 0px',
	    marginBottom: '5px',
	    display: 'flex',
	    alignItems: 'center',
	    width: 400,
	},
	input: {
	    marginLeft: 8,
	    marginRight: 8,
	    flex: 1,
	},
	icon: {
		fontSize: 40,
		color: "#ffffff"
	},
	title: {
		display: "flex",
		color: "#ffffff"
	},
	buttons: {
		display: "flex",
		justifyContent: "space-between"
	},
	error: {
		color: theme.palette.secondary.main
	}
});

@inject("routing")
@observer
class Login extends React.Component {

	state = {
		login: '',
		password: '',
		error: ''
	};

    handleChangeLogin = event => {
	    this.setState({login: event.target.value, error: null});
  	}
  	handleChangePassword = event => {
	    this.setState({password: event.target.value, error: null});
  	}


	login = e => {
		e.preventDefault();
		this.setState({error: null});
        new AuthenticationApi().login(this.state.login, this.state.password).then((token) => {
        	if (token) {
				sessionStorage.setItem("user", token);
				console.log(jwt_decode(token));
				this.props.onLogin();
			}
        })
        .catch((error) => {
		    this.setState({error: error});
  	    })
    }

	render() {
		const { classes } = this.props;
		const { push } = this.props.routing;

		return (
			<div className={classes.container}>
				<Paper className={classes.login} elevation={1}>
					<div className={classes.title}>
						<PersonIcon className={classes.icon} />
						<Typography variant="h4" gutterBottom className={classes.title}>Connexion</Typography>
					</div>
					{this.state.error &&
						<Typography variant="subtitle2" gutterBottom className={classes.error}>{this.state.error.message}</Typography>
					}
			        <form onSubmit={this.login}>
				        <Paper className={classes.root} elevation={1}>
				        	<InputBase className={classes.input} placeholder="Login" onChange={this.handleChangeLogin}/>
				        </Paper>
				        <Paper className={classes.root} elevation={1}>
				        	<InputBase type="password" className={classes.input} placeholder="Password" onChange={this.handleChangePassword}/>
				        </Paper>
				        <div className={classes.buttons}>
				        	<Button variant="outlined" onClick={() => push('/register')}>Register</Button>
				        	<Button variant="contained" color="secondary" type="submit">
				        		Connexion
				        	</Button>
				        </div>
				    </form>
				</Paper>
			</div>
		)
	}
}

export default withStyles(styles)(Login);