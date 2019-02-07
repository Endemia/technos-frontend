import React from 'react';
import { observer, inject } from 'mobx-react';
import { debounce } from "throttle-debounce";

@inject("technosStore")
@observer
class SearchBox extends React.Component {

	constructor(props) {
        super(props);
        this.state = { query: "" };
        this.updateStoreDebounced = debounce(500, this.updateStore);
        this.changeQuery = this.changeQuery.bind(this);
	}

	changeQuery(e) {
		this.setState({ query: e.target.value }, () => {
	      	this.updateStoreDebounced(this.state.query);
	    });
		
	}

	updateStore(query) {
		this.props.technosStore.getTechnos(query);
	}


	render() {

		return (
			<div>
				<input type="text" id="searchBox" className="searchBox" placeholder="Search" value={this.state.query} onChange={this.changeQuery}></input>
			</div>
		)
	}
}

export default SearchBox;