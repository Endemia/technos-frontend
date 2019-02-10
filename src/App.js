import React, { Component } from 'react';
import './App.css';
import technosStore from './stores/TechnosStore';
import searchStore from './stores/SearchStore';
import { Provider } from 'mobx-react';

import NavBar from './components/navBar.component';
import GraphContainer from './components/graphContainer.component';

class App extends Component {

  	render() {
	    return (
	      <Provider technosStore={technosStore} searchStore={searchStore}>
	        <div className="App">
		        <NavBar></NavBar>
	        	<GraphContainer></GraphContainer>
	        </div>
	      </Provider>
	    );
    }
}

export default App;
