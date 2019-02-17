import React from 'react';
import { observer, inject } from 'mobx-react';
import { debounce } from "throttle-debounce";
import TechnosApi from '../../api/TechnosApi';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
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

const styles = theme => ({
});

@inject("searchStore", "technosStore", "notesStore")
@observer
class CreationTechnoModale extends React.Component {

	state = {
        createName: ""
    }

	constructor(props) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChangeCreateName = this.handleChangeCreateName.bind(this);
        this.updateExistingListDebounced = debounce(300, this.updateExistingList);
    }

    handleCreate() {
        new TechnosApi().createTechno(this.state.createName);
    }
    handleChangeCreateName(e) {
        this.updateExistingListDebounced(e.target.value);
    }
    updateExistingList(query) {
        if (query) {
            this.setState({createName: query});
            this.props.searchStore.getExistingTechnos(query);
        } else {
            this.setState({createName: ""});
            this.props.searchStore.creationDisabled = true;
            this.props.searchStore.clearExistingTechnos();
        }
    }

	goToTechno(technoName) {
        this.props.technosStore.getTechnos(technoName, true);
        this.props.onClose();
    }

    render() {

        const { classes } = this.props;

        return (
        	<div>
        		<Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title" >
                    <DialogTitle id="form-dialog-title">Ajouter une techno</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Vous pouvez ajouter une nouvelle techno et la lier à une techno existante.
                        </DialogContentText>
                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <TextField autoFocus margin="dense" id="name" label="Nom" type="text" fullWidth onChange={this.handleChangeCreateName}/>
                            </Grid>
                            <Grid item xs={6}>
                                {this.props.searchStore.existingTechnos.length > 0 &&
                                    <List dense={true} className="search-already-exists">
                                        <ListItem key="header"><ListItemText secondary="Technos connues" /></ListItem>
                                        {this.props.searchStore.existingTechnos.map(techno => {
                                            return (<ListItem button key={techno.name} onClick={e => this.goToTechno(techno.name)}><ListItemIcon><ForwardIcon /></ListItemIcon><ListItemText primary={techno.name}/></ListItem>)
                                        })
                                        }
                                    </List>
                                }
                                {this.props.searchStore.existingTechnos.length === 0 && this.state.createName !== "" &&
                                    <List dense={true} className="search-already-exists">
                                        <ListItem key="header"><ListItemText secondary="Technos connues" /></ListItem>
                                        <ListItem key="aucune"><ListItemText primary="Aucune" /></ListItem>
                                    </List>
                                }
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} color="primary">Cancel</Button>
                        <Button disabled={this.props.searchStore.creationDisabled} onClick={this.handleCreate} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}

export default withStyles(styles)(CreationTechnoModale);