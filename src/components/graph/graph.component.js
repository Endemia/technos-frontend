import React from 'react';
import ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import joint from 'jointjs/index';
import TechnoRectangle from '../../jointjs-configuration/TechnoRectangle';

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import CreationTechnoModale from '../creationTechno/creationTechnoModale.component';

const styles = theme => ({
    fab: {
        position: 'absolute',
        top: 0,
        left: 950,
        margin: theme.spacing.unit,
    }
});

@inject("searchStore", "technosStore", "notesStore")
@observer
class Graph extends React.Component {

    state = {
        open: false
    }

	constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph();
        this.nodeMap = {};

        joint.layout.DirectedGraph.layout(this.graph);
        this.onUpdateNote = this.onUpdateNote.bind(this);
        this.handleClickOpenCreationModale = this.handleClickOpenCreationModale.bind(this);
        this.handleCloseCreationModale = this.handleCloseCreationModale.bind(this);
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

        const noteForTechno = this.props.notes.filter(n => n.techno === tech);

        const techRect = new TechnoRectangle(100, 100, tech, noteForTechno.length > 0 ? noteForTechno[0].note : 0, focus, this.onUpdateNote).getShape();
        techRect.addTo(this.graph);

        this.nodeMap[tech]=techRect.id;
    }

    onUpdateNote(techno, note) {
        this.props.notesStore.updateUserNote(techno, note);
    }

    addLink(link) {
        if (link.from && link.to) {
            const sourceId = this.nodeMap[link.from];

            const destId = this.nodeMap[link.to];

            const arrow = new joint.shapes.standard.Link({
                source: { id: sourceId },
                target: { id: destId },
                attrs: {
                    line: {
                        stroke: '#4b4a67',
                        strokeWidth: 2,
                        sourceMarker: {
                        },
                        targetMarker: {
                            'type': 'circle',
                            'r': 0,
                            'stroke': '#4b4a67',
                            'fill': '#4b4a67',
                        }
                    },
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
    handleClickOpenCreationModale() {
        this.setState({ open: true });
    }
    handleCloseCreationModale() {
        this.setState({ open: false, createName: "" });
        this.props.searchStore.clearExistingTechnos();
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
                <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={this.handleClickOpenCreationModale}>
                    <AddIcon />
                </Fab>
                <div id="playground" ref="placeholder">
                </div>
                <CreationTechnoModale open={this.state.open} onClose={this.handleCloseCreationModale}></CreationTechnoModale>
            </div>
        )
    }
}

export default withStyles(styles)(Graph);