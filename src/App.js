import React, { Component } from 'react';
import './App.css';
import technosStore from './stores/TechnosStore';
import { Provider } from 'mobx-react';

import GraphContainer from './components/graphContainer.component';

class App extends Component {
  	render() {

    return (
      <Provider technosStore={technosStore}>
        <div className="App">
        	<GraphContainer></GraphContainer>
        </div>
      </Provider>
    );
  }
}

export default App;
