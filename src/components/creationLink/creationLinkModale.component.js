import React from 'react';
import { observer, inject } from 'mobx-react';
import { debounce } from "throttle-debounce";
import TechnosApi from '../../api/TechnosApi';
import { withStyles } from '@material-ui/core/styles';
import { renderInputComponent, renderSuggestion, getSuggestionValue } from './suggestUtils'
import { withSnackbar } from 'notistack';

import Autosuggest from 'react-autosuggest';
import Drawer from '@material-ui/core/Drawer';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        height: 250,
        flexGrow: 1,
    },
    container: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    linkType: {
        display: 'inline'
    },
    spacer: {
        paddingRight: 30
    },
    verticalSpacer: {
        marginTop: 10
    },
    group: {
        backgroundColor: 'rgba(255, 255, 255, .1)',
        margin: "12px -12px"
    },
    drawer: {
      height:"100%",
      maxWidth: 500,
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
      background: "#3d5462",
      backgroundImage: "-webkit-radial-gradient(top, circle farthest-corner, #6a91a0, #3d5462 80%)",
      backgroundImage: "-moz-radial-gradient(top, circle farthest-corner, #6a91a0, #3d5462 80%)",
      backgroundImage: "-o-radial-gradient(top, circle farthest-corner, #6a91a0, #3d5462 80%)",
      backgroundImage: "radial-gradient(top, circle farthest-corner, #6a91a0, #3d5462 80%)",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale"
    },
    title: {
        color: "#ffffff"
    },
    thinnerBoth: {
        padding: "0 12px 0 12px !important"
    },
    thinnerTop: {
        padding: "0 12px 12px 12px !important"
    },
    searchAlreadyExists: {
        backgroundColor: 'rgba(255,255,255,.2)',
        marginTop: 20,
        overflowY: 'scroll',
        maxHeight: 300,
        scrollbarColor: '#e62b2b #2e3441',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar-button': {
            display: 'none',
            height: 13,
            borderRadius: 0,
            backgroundColor: '#AAA'
        },
        '&::-webkit-scrollbar-button:hover': {
            backgroundColor: '#AAA'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c62828',
            borderRadius: 4
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#e62b2b'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#2e3441',
            borderRadius: 4
        },
        '&::-webkit-scrollbar-track:hover': {
            backgroundColor: '#2e3441',
            borderRadius: 4
        },
        '&::-webkit-scrollbar': {
            width: 8
        },
    },
    suggestionList: {
        maxHeight: 400,
        overflowY: 'auto',
        backgroundColor: 'rgba(255,255,255,.2)',
        '&::-webkit-scrollbar-button': {
            display: 'none',
            height: 13,
            borderRadius: 0,
            backgroundColor: '#AAA'
        },
        '&::-webkit-scrollbar-button:hover': {
            backgroundColor: '#AAA'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c62828',
            borderRadius: 4
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#e62b2b'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#2e3441',
            borderRadius: 4
        },
        '&::-webkit-scrollbar-track:hover': {
            backgroundColor: '#2e3441',
            borderRadius: 4
        },
        '&::-webkit-scrollbar': {
            width: 8
        },
    },
    chip: {
        margin: '0 5px 3px 0'
    }
});

@inject("searchStore", "technosStore", "notesStore")
@observer
class CreationLinkModale extends React.Component {
	state = {
        createLinkFrom: "",
        createLinkTo: "",
        createLinkFromSelected: false,
        createLinkToSelected: false,
        suggestions: this.props.searchStore.existingTechnosLink,
    };

	constructor(props) {
        super(props);
        this.updateExistingListLinkDebounced = debounce(300, this.updateExistingListLink);
    }

    handleCreate = () => {
        new TechnosApi().createLink(this.state.createLinkFrom, this.state.createLinkTo).then((res) => {
        	if (res) {
	            this.props.enqueueSnackbar('Lien ajouté.', {variant:'success', autoHideDuration:1000});
	            this.props.searchStore.setQuery(this.state.createLinkFrom);
            	this.props.searchStore.setExactQuery(true);
            	this.props.technosStore.centerOn(this.state.createLinkFrom);
	            this.props.onClose();
	        } else {
	        	this.props.enqueueSnackbar('Erreur lors de l\'ajout du lien.', {variant:'error', autoHideDuration:1000});
	        }
        })
    }
    updateExistingListLink = (query) => {
        if (query) {
            this.props.searchStore.getExistingTechnosLink(query).then(res => {
                this.setState({suggestions: res});
            });
        } else {
            this.props.searchStore.clearExistingTechnosLink();
        }
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.updateExistingListLinkDebounced(value)
    }

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    }

    handleChange = name => (event, { newValue }) => {
        this.setState({
            [name]: newValue,
        });
    }

    selectSuggestionFrom = (suggestion) => {
    	this.setState({createLinkFromSelected: true});
        return getSuggestionValue(suggestion);
    }
    selectSuggestionTo = (suggestion) => {
    	this.setState({createLinkToSelected: true});
        return getSuggestionValue(suggestion);
    }

    render() {
        
        const { classes } = this.props;
        
        const autosuggestProps = {
            renderInputComponent,
            suggestions: this.state.suggestions,
            onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
            onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
            renderSuggestion
        };
        
        return (
        	<div>
        		<Drawer anchor="right" open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                    <div className={classes.drawer}>
                        <DialogTitle id="form-dialog-title" className={classes.title}>Ajouter un lien</DialogTitle>
                        <DialogContent style={{overflowY:'hidden'}}>
                            <DialogContentText>
                                Vous pouvez ajouter un nouveau lien entre deux technos.
                            </DialogContentText>
                            <div className={classes.content}>
                                <Grid container spacing={24} className={classes.group}>
                                    <Grid item xs={12} className={classes.thinnerTop}>
                                        <Autosuggest
                                          {...autosuggestProps}
                                          getSuggestionValue = {this.selectSuggestionFrom}
                                          inputProps={{
                                            classes,
                                            label: 'De',
                                            value: this.state.createLinkFrom,
                                            onChange: this.handleChange('createLinkFrom'),
                                          }}
                                          theme={{
                                            container: classes.container,
                                            suggestionsList: classes.suggestionsList,
                                            suggestion: classes.suggestion,
                                          }}
                                          renderSuggestionsContainer={options => (
                                            <Paper {...options.containerProps} square id="suggest" className={classes.suggestionList}>
                                              {options.children}
                                            </Paper>
                                          )}
                                        />
                                        
                                    </Grid>
                                </Grid>
                                <Grid container spacing={24} className={classes.group}>
                                    <Grid item xs={12} className={classes.thinnerTop}>
                                        <Autosuggest
                                          {...autosuggestProps}
                                          getSuggestionValue = {this.selectSuggestionTo}
                                          inputProps={{
                                            classes,
                                            label: 'Vers',
                                            value: this.state.createLinkTo,
                                            onChange: this.handleChange('createLinkTo'),
                                          }}
                                          theme={{
                                            container: classes.container,
                                            suggestionsList: classes.suggestionsList,
                                            suggestion: classes.suggestion,
                                          }}
                                          renderSuggestionsContainer={options => (
                                            <Paper {...options.containerProps} square id="suggest" className={classes.suggestionList}>
                                              {options.children}
                                            </Paper>
                                          )}
                                        />
                                        
                                    </Grid>
                                </Grid>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" onClick={this.props.onClose}>Cancel</Button>
                            <Button variant="contained" color="secondary" disabled={!this.state.createLinkFromSelected || !this.state.createLinkToSelected} onClick={this.handleCreate} >Create</Button>
                        </DialogActions>
                    </div>
                </Drawer>
            </div>
        )
    }

}

export default withStyles(styles)(withSnackbar(CreationLinkModale));