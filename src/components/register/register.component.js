import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import { debounce } from "throttle-debounce";

import config from '../../conf/config.json';
import AuthenticationApi from '../../api/AuthenticationApi';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import PersonIcon from '@material-ui/icons/Person';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import Cancel from '@material-ui/icons/Cancel';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Button from '@material-ui/core/Button';
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
	inputPaper: {
	    padding: '4px 0px',
	    marginBottom: '5px',
	    display: 'flex',
	    alignItems: 'center',
	},
	error: {
		color: theme.palette.secondary.main,
	},
	ok: {
		color: '#28c62d',	
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
	divider: {
		marginBottom: 10,
	},
	verticalSpacing: {
		marginBottom: 20,
	},
	verticalAlign: {
		display: "flex",
   		flexDirection: "column",
    	justifyContent: "space-around",
	}
});

@inject("routing")
@observer
class Register extends React.Component {

	state = {
	    login: '',
	    password: '',
	    confirmPassword: '',
	    nom: '',
	    prenom: '',
	    email: '',
	    loginOk: "empty",
	    passwordOk: "empty",
	    nomOk: "empty",
	    prenomOk: "empty",
	    emailOk: "empty",
	    registerDisabled: true,
	    confirmRegistration: false,
	};

	loginMaxLength = config.loginMinLength;

	constructor(props) {
        super(props);
        this.checkPasswordDebounced = debounce(500, this.checkPassword);
        this.checkLoginDebounced = debounce(500, this.checkLogin);
        this.checkNomDebounced = debounce(500, this.checkNom);
        this.checkPrenomDebounced = debounce(500, this.checkPrenom);
        this.checkEmailDebounced = debounce(500, this.checkEmail);
        this.registerDebounced = debounce(500, this.register);
	}

	handleChange = name => event => {
    	this.setState({ [name]: event.target.value });
    	if (name === "password" || name === "confirmPassword" ) {
    		this.checkPasswordDebounced();
    	}
    	if (name === "login") {
    		this.checkLoginDebounced();
    	}
    	if (name === "nom") {
    		this.checkNomDebounced();
    	}
    	if (name === "prenom") {
    		this.checkPrenomDebounced();
    	}
    	if (name === "email") {
    		this.checkEmailDebounced();
    	}
  	};

  	checkPassword = () => {
  		if (this.state.password !== "" || this.state.confirmPassword !== "") {
	  		if (this.state.password !== this.state.confirmPassword) {
	  			this.setState({ passwordOk: "notOk" });
	  		} else {
	  			this.setState({ passwordOk: "ok" });
	  		}
	  	} else {
	  		this.setState({ passwordOk: "empty" });
	  	}
	  	this.checkRegisterEnable();
  	}

  	checkLogin = () => {
		this.setState({loginOk: "checking"});
  		if (this.state.login !== "") {
  			if (this.state.login.length >= this.loginMaxLength) {
	  			new AuthenticationApi().isLoginAvailable(this.state.login).then(res => {
	  				this.setState({loginOk: (res === false) ? "notOk" : "ok"});
	  				this.checkRegisterEnable();
	  			})
	  		} else {
	  			this.setState({loginOk: "tooShort"});
	  			this.checkRegisterEnable();
	  		}
  		} else {
  			this.setState({loginOk: "empty"});
  			this.checkRegisterEnable();
  		}
  	}

  	checkNom = () => {
  		if (this.state.nom !== "") {
  			this.setState({ nomOk: "ok" });
  		} else {
  			this.setState({ nomOk: "notOk" });
  		}
  		this.checkRegisterEnable();
  	}

  	checkPrenom = () => {
  		if (this.state.prenom !== "") {
  			this.setState({ prenomOk: "ok" });
  		} else {
  			this.setState({ prenomOk: "notOk" });
  		}
  		this.checkRegisterEnable();
  	}

  	checkEmail = () => {
  		if (this.state.email !== "") {
  			var re = /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@cgi.com$/;
  			if (re.test(this.state.email)) {
  				this.setState({ emailOk: "ok" });
  			} else {
  				this.setState({ emailOk: "notOk" });
  			}
  		} else {
  			this.setState({ emailOk: "notOk" });
  		}
  		this.checkRegisterEnable();
  	}

  	checkRegisterEnable = () => {
  		if (this.state.loginOk === "ok" && this.state.passwordOk === "ok" && this.state.nomOk === "ok" && this.state.prenomOk === "ok" && this.state.emailOk === "ok") {
  			this.setState({registerDisabled : false})
  			return true;
  		} else {
  			this.setState({registerDisabled : true})
  			return false;
  		}
  	}

  	register = () => {
  		if (this.checkRegisterEnable()) {
  			this.setState({ registerDisabled: true });
			new AuthenticationApi().register(this.state.login, this.state.password, this.state.nom, this.state.prenom, this.state.email)
			.then(res => {
				this.setState({confirmRegistration: true})
			})
			.catch(error => {
				this.setState({ registerDisabled: false });
			})
		}
  	}

	render() {

		const { classes } = this.props;
		const { push } = this.props.routing;

		return (
			<div className={classes.container}>
				<Paper className={classes.register} elevation={1}>
					<div className={classes.title}>
						<PersonIcon className={classes.icon} />
						<Typography variant="h4" gutterBottom className={classes.title}>Register</Typography>
					</div>
					
					{this.state.confirmRegistration &&
						<div>
							<Typography variant="h6">
								Merci de vous être inscrit.<br></br>Un e-mail contenant les instructions pour activer votre compte vous a été envoyé ({this.state.email}).
							</Typography>
						</div>
					}

					{!this.state.confirmRegistration &&
						<div>
					        <Typography variant="caption">
					          	Authentification
					        </Typography>
							<Divider className={classes.divider}/>


							<Grid container spacing={16}>
								<Grid item xs={6}>
							        <Paper className={classes.inputPaper} elevation={1}>
							        	<InputBase className={classes.input} placeholder="Login*" onChange={this.handleChange('login')}
							        		endAdornment={
							        			<InputAdornment position="end">
							        				{this.state.loginOk === "checking" && <CircularProgress className={classes.progress} size={20} />}
							        				{this.state.loginOk === "ok" && <CheckCircle className={classes.ok} />}
							        				{(this.state.loginOk === "notOk" || this.state.loginOk === "tooShort") && <Cancel className={classes.error} />}
							        			</InputAdornment>}
							        	/>
							        </Paper>
							    </Grid>
							    <Grid item xs={6} className={classes.verticalAlign}>
							    	{this.state.loginOk === "notOk" && <Typography color="secondary" variant="caption">Non disponible.</Typography>}
							    	{this.state.loginOk === "tooShort" && <Typography color="secondary" variant="caption">{`Le login doit contenir au moins ${config.loginMinLength} caractères`}</Typography>}
							    </Grid>
							    <Grid item xs={6}>
							        <Paper className={classes.inputPaper} elevation={1}>
							        	<InputBase className={classes.input} placeholder="Password*" onChange={this.handleChange('password')} />
							        </Paper>
							    </Grid>
							    <Grid item xs={6}>
							        <Paper className={classes.inputPaper} elevation={1}>
							        	<InputBase className={classes.input} placeholder="Confirm password*" onChange={this.handleChange('confirmPassword')}
							        		endAdornment={
							        			<InputAdornment position="end">
							        				{this.state.passwordOk === "ok" && <CheckCircle className={classes.ok} />}
							        				{this.state.passwordOk === "notOk" && <Cancel className={classes.error} />}
						        				</InputAdornment>}
							        	/>
							        </Paper>
							    </Grid>
							</Grid>

							<div className={classes.verticalSpacing}></div>
							<Typography className={classes.dividerFullWidth} color="textSecondary" variant="caption">
					          	informations
					        </Typography>
							<Divider className={classes.divider}/>

							<Grid container spacing={16}>
							    <Grid item xs={6}>
							        <Paper className={classes.inputPaper} elevation={1}>
							        	<InputBase className={classes.input} placeholder="Nom*" onChange={this.handleChange('nom')}
											endAdornment={
							        			<InputAdornment position="end">
							        				{this.state.nomOk === "ok" && <CheckCircle className={classes.ok} />}
							        				{this.state.nomOk === "notOk" && <Cancel className={classes.error} />}
							        			</InputAdornment>}
							        	/>
							        </Paper>
							    </Grid>
							    <Grid item xs={6}>
							        <Paper className={classes.inputPaper} elevation={1}>
							        	<InputBase className={classes.input} placeholder="Prenom*" onChange={this.handleChange('prenom')}
							        		endAdornment={
							        			<InputAdornment position="end">
							        				{this.state.prenomOk === "ok" && <CheckCircle className={classes.ok} />}
							        				{this.state.prenomOk === "notOk" && <Cancel className={classes.error} />}
							        			</InputAdornment>}
							        	/>
							        </Paper>
							    </Grid>
							    <Grid item xs={6}>
							        <Paper className={classes.inputPaper} elevation={1}>
							        	<InputBase className={classes.input} placeholder="Email*" onChange={this.handleChange('email')}
							        		endAdornment={
						        				<InputAdornment position="end">
							        				{this.state.emailOk === "ok" && <CheckCircle className={classes.ok} />}
							        				{this.state.emailOk === "notOk" && <Cancel className={classes.error} />}
							        			</InputAdornment>}
							        	/>
							        </Paper>
							    </Grid>
							    <Grid item xs={6} className={classes.verticalAlign}>
							    	{this.state.emailOk === "notOk" && <Typography color="secondary" variant="caption">Doit être une adresse mail CGI.</Typography>}
							    </Grid>
							</Grid>
							<div className={classes.buttons}>
					        	<Button variant="outlined" onClick={() => push('/')}>Cancel</Button>
					        	<Button variant="contained" color="secondary" disabled={this.state.registerDisabled} onClick={this.registerDebounced}>
					        		Register
					        	</Button>
					        </div>
					    </div>
				    }
				</Paper>
			</div>
		)
	}
}

export default withStyles(styles)(Register);