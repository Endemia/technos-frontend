import React, { Component} from 'react';
import { observer, inject } from 'mobx-react';
import { debounce } from "throttle-debounce";

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 1015,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};

@inject("technosStore", "searchStore")
@observer
class SearchBox extends Component {

	constructor(props) {
        super(props);
        this.updateStoreDebounced = debounce(500, this.updateStore);
        this.changeQuery = this.changeQuery.bind(this);
	}

	changeQuery(e) {
		const query = e.target.value;
      	this.updateStoreDebounced(query);
	}

	updateStore(query) {
		this.props.searchStore.setQuery(query);
		this.props.technosStore.getTechnos(query);
	}

	render() {

		const { classes } = this.props;

		return (
			<Paper className={classes.root} elevation={1}>
				<InputBase className={classes.input} placeholder="Chercher" onChange={this.changeQuery} startAdornment={(<InputAdornment position="start"><SearchIcon /></InputAdornment>)} />
			</Paper>
		)
	}
}

export default withStyles(styles)(SearchBox);