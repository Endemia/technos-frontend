import React from 'react';
import ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import joint from 'jointjs/index';
import TechnoRectangle from '../jointjs-configuration/TechnoRectangle';
import TechnosApi from '../api/TechnosApi';
import { debounce } from "throttle-debounce";

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
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

const styles = theme => ({
    fab: {
        position: 'absolute',
        top: 0,
        left: 950,
        margin: theme.spacing.unit,
    }
});

@inject("searchStore", "technosStore")
@observer
class Graph extends React.Component {

    state = {
        open: false,
        createName: ""
    }

	constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph();
        this.nodeMap = {};

        joint.layout.DirectedGraph.layout(this.graph);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChangeCreateName = this.handleChangeCreateName.bind(this);
        this.updateExistingListDebounced = debounce(500, this.updateExistingList);
    }

    componentDidMount() {

        this.paper = new joint.dia.Paper({
            el: ReactDOM.findDOMNode(this.refs.placeholder),
            width: 1024,
            height: 700,
            background: { color: '#eeeeee'},
            model: this.graph,
            restrictTranslate: true
        });

    }

	addNode(tech) {

        let focus = false;
        const searchQuery = this.props.searchStore.query;
        if (searchQuery) {
            this.regexpName = new RegExp(searchQuery.trim(), 'i');
            focus = this.regexpName.test(tech);
        }

        const techRect = new TechnoRectangle(100, 100, tech, 0, focus).getShape();
        techRect.addTo(this.graph);

        this.nodeMap[tech]=techRect.id;
    }

    addLink(link) {
        if (link.from && link.to) {
            const sourceId = this.nodeMap[link.from];

            const destId = this.nodeMap[link.to];

            const arrow = new joint.shapes.standard.Link({
                source: { id: sourceId },
                target: { id: destId },
                attrs: {
                    '.connection': {
                        'fill': 'none',
                        'stroke-linejoin': 'round',
                        'stroke-width': '2',
                        'stroke': '#4b4a67'
                    }
                }
            });

            arrow.addTo(this.graph);
        }
    }

    clear() {
        Object.keys(this.nodeMap).forEach(key => {
            const cell = this.graph.getCell(this.nodeMap[key]);
            if (cell) {
                cell.remove();
            }
        });
        this.nodeMap = {};
    }

    handleClickOpen() {
        this.setState({ open: true });
    }
    handleClose() {
        this.setState({ open: false, createName: "" });
        this.props.searchStore.clearExistingTechnos();
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
        this.handleClose();
    }

    render() {

        const { classes } = this.props;

        this.clear();
        
        this.props.technos.nodes.forEach((node) => {
            this.addNode(node);
        });
        this.props.technos.links.forEach((link) => {
            this.addLink(link);
        });

        joint.layout.DirectedGraph.layout(this.graph, { marginX: 50, marginY: 50 });

        return (
            <div className="graph">
                <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={this.handleClickOpen}>
                    <AddIcon />
                </Fab>
                <div id="playground" ref="placeholder">
                </div>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" >
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
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button disabled={this.props.searchStore.creationDisabled} onClick={this.handleCreate} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(Graph);