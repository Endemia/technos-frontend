import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import Menu from '@material-ui/core/Menu';
import { observer, inject } from 'mobx-react';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    userName: {
        color: "#ffffff",
        display: 'flex',
    }
};

@inject("routing", "userStore")
@observer
class NavBar extends Component {

    state = {
        anchorEl: null,
    }

    openMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    }
    closeMenu = () => {
        this.setState({ anchorEl: null });
    }

    goHome = (e) => {
        e.preventDefault();
        this.setState({ anchorEl: null });
        if (this.props.routing.location.pathname !== '/') {
            this.props.routing.push('/');
        }
    }

    goListe = (e) => {
        e.preventDefault();
        this.setState({ anchorEl: null });
        if (this.props.routing.location.pathname !== '/technos') {
            this.props.routing.push('/technos');
        }
    }

    logout = () => {
        sessionStorage.removeItem("user");
        this.props.onLogout();
    }

  	render() {
  		const { classes } = this.props;
        const { push } = this.props.routing;
        const { anchorEl } = this.state;

  		return (
	        <AppBar position="static">
	        	<Toolbar variant="dense">
	          		<IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.openMenu}>
	            		<MenuIcon />
	          		</IconButton>
	          		<Typography variant="h6" color="inherit" className={classes.grow}>
	            		News
	          		</Typography>
                    <MenuItem>
                        <Button variant="contained" color="secondary" onClick={() => push('/technos')}>Change url</Button>
                    </MenuItem>
                    
                        <div className={classes.userName}><PersonPinIcon></PersonPinIcon>{this.props.userStore.user.prenom} {this.props.userStore.user.nom}</div>
                    
                    <MenuItem>
    	          		<Button variant="contained" color="secondary" onClick={this.logout}>Logout</Button>
                    </MenuItem>
	        	</Toolbar>
                <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.closeMenu} >
                    <MenuItem onClick={this.goHome}>Home</MenuItem>
                    <MenuItem onClick={this.goListe}>Liste</MenuItem>
                    <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                </Menu>
	      	</AppBar>
	    );
    }
}

export default withStyles(styles)(NavBar);
