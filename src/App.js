import React, { Component } from 'react';
import './App.css';
import technosStore from './stores/TechnosStore';
import searchStore from './stores/SearchStore';
import notesStore from './stores/NotesStore';
import { Provider } from 'mobx-react';
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route } from "react-router";

import NavBar from './components/navBar/navBar.component';
import GraphContainer from './components/graph/graphContainer.component';
import TechnosListContainer from './components/technosList/technosListContainer.component';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);

class App extends Component {

  	render() {
	    return (
	      	<Provider technosStore={technosStore} searchStore={searchStore} notesStore={notesStore} routing={routingStore}>
	      		<Router history={history}>
		        	<div className="App">
			        	<NavBar></NavBar>
			        	<Route path="/" exact component={GraphContainer} />
			        	<Route path="/technos" component={TechnosListContainer} />
			        </div>
		     	</Router>
	      	</Provider>
	    );
    }
}

export default App;
