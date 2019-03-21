import React, { Component } from 'react';
import './App.css';
import theme from './theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import technosStore from './stores/TechnosStore';
import searchStore from './stores/SearchStore';
import notesStore from './stores/NotesStore';
import userStore from './stores/UserStore';
import { Provider } from 'mobx-react';
import appHistory from './history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route } from "react-router";
import { SnackbarProvider } from 'notistack';
import jwt_decode from 'jwt-decode';

import Login from './components/login/login.component';
import Register from './components/register/register.component';
import Activate from './components/register/activate.component';
import NavBar from './components/navBar/navBar.component';
import GraphContainer from './components/graph/graphContainer.component';
import TechnosListContainer from './components/technosList/technosListContainer.component';

const browserHistory = appHistory;
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);

class App extends Component {

	state = {
    	loggedIn: false,
  	}

	constructor(props) {
        super(props);
        if (sessionStorage.getItem('user')) {
        	userStore.setUser(jwt_decode(sessionStorage.getItem('user')));
        	this.state.loggedIn = true ;
        	this.getUserNotes();
        }
    }

    onLogin = () => {
        this.setState({ loggedIn: true });
        this.getUserNotes();
    }

    onLogout = () => {
    	this.setState({ loggedIn: false });
    }

    getUserNotes= () => {
        notesStore.getUserNotes();
    }

  	render() {
	    return (
	      	<Provider technosStore={technosStore} searchStore={searchStore} notesStore={notesStore} userStore={userStore} routing={routingStore}>
	      		<MuiThemeProvider theme={theme}>
		      		<Router history={history}>
		      			<SnackbarProvider maxSnack={3}>
			      			<div>
			      				<Route path="/login" component={Login} />
				      			{this.state.loggedIn
					        		? <div className="App">
						        		<NavBar onLogout={this.onLogout}></NavBar>
						        		<Route path="/" exact component={GraphContainer} />
						        		<Route path="/technos" component={TechnosListContainer} />
						        	  </div>
						        	: <div>
						        		<Route path="/" exact component={() => <Login onLogin={this.onLogin}></Login>} />
						        	  	<Route path="/register" component={Register} />
						        	  	<Route path="/activate/login/:login/key/:registerKey" component={Activate} />
						        	  </div>
						        }
						    <div className="bg-image"></div>
					        </div>
					    </SnackbarProvider>
			     	</Router>
			    </MuiThemeProvider>
	      	</Provider>
	    );
    }
}

export default App;
