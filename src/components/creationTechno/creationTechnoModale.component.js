import React from 'react';
import { observer, inject } from 'mobx-react';
import { debounce } from "throttle-debounce";
import TechnosApi from '../../api/TechnosApi';
import { withStyles } from '@material-ui/core/styles';
import { renderInputComponent, renderSuggestion, getSuggestionValue } from './suggestUtils'
import Highlighter from "react-highlight-words";
import { withSnackbar } from 'notistack';

import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Drawer from '@material-ui/core/Drawer';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ForwardIcon from '@material-ui/icons/Forward';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chip from '@material-ui/core/Chip';

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
class CreationTechnoModale extends React.Component {

	state = {
        createName: "",
        createLink: "",
        links: [],
        linkType: "child",
        creationDisabled: true,
        suggestions: this.props.searchStore.existingTechnosLink,
    };

	constructor(props) {
        super(props);
        this.updateExistingListDebounced = debounce(300, this.updateExistingList);
        this.updateExistingListLinkDebounced = debounce(300, this.updateExistingListLink);
    }

    handleCreate = () => {
        new TechnosApi().createTechno(this.state.createName, this.state.links, this.state.linkType).then((res) => {
            this.props.enqueueSnackbar('Techno ajoutée.', {variant:'success', autoHideDuration:1000});
            this.props.technosStore.getTechnos(res.name);
            this.props.onClose();
        })
    }
    handleChangeCreateName = (e) => {
        this.updateExistingListDebounced(e.target.value);
    }
    handleChangeCreateLink = (e) => {
        this.updateExistingListLinkDebounced(e.target.value);
    }
    handleChangeLinkType = (e) => {
        this.setState({linkType: e.target.value})
    }
    updateExistingList = (query) => {
        if (query) {
            this.setState({createName: query, creationDisabled: false});
            this.props.searchStore.getExistingTechnos(query);
        } else {
            this.setState({createName: "", creationDisabled: true});
            this.props.searchStore.clearExistingTechnos();
        }
    }
    updateExistingListLink = (query) => {
        if (query) {
            this.setState({createLink: query});
            this.props.searchStore.getExistingTechnosLink(query).then(res => {
                this.setState({suggestions: res});
            });
        } else {
            this.setState({createLink: ""});
            this.props.searchStore.clearExistingTechnosLink();
        }
    }

	goToTechno = (technoName) => {
        this.props.technosStore.getTechnos(technoName, true);
        this.props.onClose();
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

    selectSuggestion = (suggestion) => {
        const value =  getSuggestionValue(suggestion);
        if (this.state.links.indexOf(value) < 0) {
            this.state.links.push(value);
        }
        return "";
    }

    handleDeleteLink = (linkToDelete) => {
        this.setState({links: this.state.links.filter(link => link !== linkToDelete)});
    }

    render() {
        
        const { classes } = this.props;
        
        const autosuggestProps = {
            renderInputComponent,
            suggestions: this.state.suggestions,
            onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
            onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
            getSuggestionValue : this.selectSuggestion,
            renderSuggestion
        };
        
        return (
        	<div>
        		<Drawer anchor="right" open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                    <div className={classes.drawer}>
                        <DialogTitle id="form-dialog-title" className={classes.title}>Ajouter une techno</DialogTitle>
                        <DialogContent style={{overflowY:'hidden'}}>
                            <DialogContentText>
                                Vous pouvez ajouter une nouvelle techno et la lier à une techno existante.
                            </DialogContentText>
                            <div className={classes.content}>
                                <Grid container spacing={24} className={classes.group}>
                                    <Grid item xs={12} className={classes.thinnerBoth}>
                                        <TextField margin="dense" label="Nouvelle techno" type="text" fullWidth onChange={this.handleChangeCreateName} helperText=" "/>
                                    </Grid>
                                    <Grid item xs={12} className={classes.thinnerBoth}>
                                        {this.props.searchStore.existingTechnos.length > 0 &&
                                            <div>
                                                <List dense={true} className={classes.searchAlreadyExists}>
                                                    <ListItem key="header"><ListItemText secondary="Technos connues" /></ListItem>
                                                    {this.props.searchStore.existingTechnos.map(techno => {
                                                        return (
                                                            <ListItem button key={techno.name} onClick={e => this.goToTechno(techno.name)}>
                                                                <ListItemIcon><ForwardIcon /></ListItemIcon>
                                                                <Highlighter highlightClassName='hightlight' searchWords={[this.state.createName]} autoEscape={true} textToHighlight={techno.name} />
                                                            </ListItem>
                                                        )
                                                    })
                                                    }
                                                </List>
                                                <div className={classes.verticalSpacer}></div>
                                            </div>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid container spacing={24} className={classes.group}>
                                    <Grid item xs={12} className={classes.thinnerBoth}>
                                        <RadioGroup name="linkType" className={classes.linkType} value={this.state.linkType} onChange={this.handleChangeLinkType} >
                                            <FormControlLabel className={classes.spacer} value="child" control={<Radio />} label="Enfant de" />
                                            <FormControlLabel className={classes.spacer} value="parent" control={<Radio />} label="Parent de" />
                                        </RadioGroup>
                                    </Grid>
                                    
                                    {this.state.links.length > 0 &&
                                        <Grid item xs={12} className={classes.thinnerTop}>
                                            {this.state.links.map(techno => {
                                                return (
                                                    <Chip
                                                        key={techno}
                                                        label={techno}
                                                        onDelete={(e) => {this.handleDeleteLink(techno)}}
                                                        className={classes.chip}
                                                        color="secondary"
                                                    />
                                                )
                                            })}
                                        </Grid>
                                    }

                                    
                                    <Grid item xs={12} className={classes.thinnerTop}>
                                        <Autosuggest
                                          {...autosuggestProps}
                                          inputProps={{
                                            classes,
                                            label: 'Chercher',
                                            value: this.state.createLink,
                                            onChange: this.handleChange('createLink'),
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
                            <Button variant="contained" color="secondary" disabled={this.state.creationDisabled || this.props.searchStore.existingTechnosExactMatch} onClick={this.handleCreate} >Create</Button>
                        </DialogActions>
                    </div>
                </Drawer>
            </div>
        )
    }

}

export default withStyles(styles)(withSnackbar(CreationTechnoModale));