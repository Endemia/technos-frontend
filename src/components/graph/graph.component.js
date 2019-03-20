import React from 'react';
import ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import joint from 'jointjs/index';
import TechnoRectangle from '../../jointjs-configuration/TechnoRectangle';
import $ from 'jquery';

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import LinkIcon from '@material-ui/icons/Link';

import CreationTechnoModale from '../creationTechno/creationTechnoModale.component';
import CreationLinkModale from '../creationLink/creationLinkModale.component';

const styles = theme => ({
    fab: {
        position: 'absolute',
        top: 86,
        left: 930,
        margin: theme.spacing.unit,
        zIndex: 10
    },
    fabLink: {
        position: 'absolute',
        top: 146,
        left: 930,
        margin: theme.spacing.unit,
        zIndex: 10
    },
    playground: {
        height: '100%'
    },
    emptySearch: {
        position: 'absolute',
        top:'50%',
        left: '40%',
        backgroundColor: 'rgba(255, 255, 255, .1)',
        padding: 10,
        fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
        color: 'rgba(255, 255, 255, .2)',
        display: 'none',
        borderRadius: 20,
        width: 200
    }
});

@inject("searchStore", "technosStore", "notesStore", "userStore")
@observer
class Graph extends React.Component {

    state = {
        open: false
    }

	constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph();
        this.nodeMap = {};

    }

    componentDidUpdate = () => {
        this.paper.setDimensions(1024, $("#graph")[0].scrollHeight);
    }
    componentDidMount = () => {
        this.paper = new joint.dia.Paper({
            el: ReactDOM.findDOMNode(this.refs.placeholder),
            width: 1024,
            height: $("#graph").scrollHeight,
            model: this.graph,
            //restrictTranslate: true
        });

         if (!this.props.technos.nodes || this.props.technos.nodes.length === 0) {
            if (this.props.searchStore.query) {
                this.showNoResult(true);
            } else {
                this.showEmptySearch(true);
            }
        }
    }

	addNode = (tech) => {

        let focus = false;
        const searchQuery = this.props.searchStore.query;
        if (searchQuery) {
            if (!this.props.searchStore.exactQuery) {
                this.regexpName = new RegExp(searchQuery.replace(/[^a-zA-Z0-9\-_ ]/gi, "").trim(), 'i');
                focus = this.regexpName.test(tech);
            } else {
                focus = searchQuery === tech;
            }
        }

        const noteForTechno = this.props.notes.filter(n => n.techno === tech);

        const techRect = new TechnoRectangle(100, 100, tech, noteForTechno.length > 0 ? noteForTechno[0].note : 0, focus, this.onUpdateNote, this.onCenter).getShape();
        techRect.addTo(this.graph);

        this.nodeMap[tech]=techRect.id;
    }

    onUpdateNote = (techno, note) => {
        this.props.notesStore.updateUserNote(techno, note);
    }

    onCenter = (techno) => {
        this.props.searchStore.setExactQuery(true);
        this.props.searchStore.setQuery(techno);
        this.props.technosStore.centerOn(techno);
    }

    addLink = (link) => {
        if (link.from && link.to) {
            const sourceId = this.nodeMap[link.from];

            const destId = this.nodeMap[link.to];

            const arrow = new joint.shapes.standard.Link({
                source: { id: sourceId },
                target: { id: destId },
                attrs: {
                    line: {
                        stroke: '#fb8803',
                        strokeWidth: 2,
                        sourceMarker: {
                        }
                    },
                }
            });

            arrow.addTo(this.graph);
        }
    }

    clear = () => {
        Object.keys(this.nodeMap).forEach(key => {
            const cell = this.graph.getCell(this.nodeMap[key]);
            if (cell) {
                cell.remove();
            }
        });
        this.nodeMap = {};
        if (this.paper) {
            this.paper.setDimensions(1024, 100);
        }
    }
    handleClickOpenCreationModale = () => {
        this.setState({ open: true });
    }
    handleClickOpenCreationLinkModale = () => {
        this.setState({ openLink: true });
    }
    handleCloseCreationModale = () => {
        this.setState({ open: false });
        this.props.searchStore.clearExistingTechnos();
    }
    handleCloseCreationLinkModale = () => {
        this.setState({ openLink: false });
        this.props.searchStore.clearExistingTechnosLink();
    }
    showEmptySearch = (show) => {
        if (show) {
            $('#emptySearch').show();
        } else {
            $('#emptySearch').hide();
        }
    }
    showNoResult = (show) => {
        if (show) {
            $('#noResult').show();
        } else {
            $('#noResult').hide();
        }
    }

    render() {
        const { classes } = this.props;

        this.clear();
        
        this.showEmptySearch(false);
        this.showNoResult(false);
        if (this.props.technos.nodes && this.props.technos.nodes.length > 0) {
            this.props.technos.nodes.forEach((node) => {
                this.addNode(node);
            });
            if (this.props.technos.links) {
                this.props.technos.links.forEach((link) => {
                    this.addLink(link);
                });
            }
        } else {
            if (this.props.searchStore.query && this.props.searchStore.query.trim()) {
                this.showNoResult(true);
            } else {
                this.showEmptySearch(true);
            }
        }

        joint.layout.DirectedGraph.layout(this.graph, { marginX: 50, marginY: 50, rankDir:'LR' });        

        return (
            <div>
                <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={this.handleClickOpenCreationModale}>
                    <AddIcon />
                </Fab>
                {this.props.userStore.user.isAdmin &&
                    <Fab color="secondary" aria-label="Add link" className={classes.fabLink} onClick={this.handleClickOpenCreationLinkModale}>
                        <LinkIcon />
                    </Fab>
                }
                <div id="graph" className="graph">
                    <div id="playground" className={classes.playground} ref="placeholder">
                    </div>
                    <div id="emptySearch" className={classes.emptySearch}>Faites une recherche</div>
                    <div id="noResult" className={classes.emptySearch}>Aucun résultat</div>
                    <CreationTechnoModale open={this.state.open} onClose={this.handleCloseCreationModale}></CreationTechnoModale>
                    <CreationLinkModale open={this.state.openLink} onClose={this.handleCloseCreationLinkModale}></CreationLinkModale>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Graph);