import React, { Component } from 'react';
import './App.css';
import theme from './theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import technosStore from './stores/TechnosStore';
import searchStore from './stores/SearchStore';
import notesStore from './stores/NotesStore';
import { Provider } from 'mobx-react';
import appHistory from './history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route } from "react-router";

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
        	this.state.loggedIn = true ;
        }
    }

    onLogin = () => {
        this.setState({ loggedIn: true });
    }

    onLogout = () => {
    	this.setState({ loggedIn: false });
    }

  	render() {
	    return (
	      	<Provider technosStore={technosStore} searchStore={searchStore} notesStore={notesStore} routing={routingStore}>
	      		<MuiThemeProvider theme={theme}>
		      		<Router history={history}>
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
				        </div>
			     	</Router>
			    </MuiThemeProvider>
	      	</Provider>
	    );
    }
}

export default App;
