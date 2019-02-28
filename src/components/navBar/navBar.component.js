import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
};

@inject("routing")
@observer
class NavBar extends Component {

    logout = () => {
        sessionStorage.removeItem("user");
        this.props.onLogout();
    }

  	render() {
  		const { classes } = this.props;
        const { push } = this.props.routing;

  		return (
	        <AppBar position="static">
	        	<Toolbar variant="dense">
	          		<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
	            		<MenuIcon />
	          		</IconButton>
	          		<Typography variant="h6" color="inherit" className={classes.grow}>
	            		News
	          		</Typography>
                    <MenuItem>
                        <Button variant="contained" color="secondary" onClick={() => push('/technos')}>Change url</Button>
                    </MenuItem>
                    <MenuItem>
    	          		<Button variant="contained" color="secondary" onClick={this.logout}>Logout</Button>
                    </MenuItem>
	        	</Toolbar>
	      	</AppBar>
	    );
    }
}

export default withStyles(styles)(NavBar);
