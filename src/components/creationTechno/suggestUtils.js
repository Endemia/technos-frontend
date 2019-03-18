import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Highlighter from "react-highlight-words";


const renderInputComponent = (inputProps) => {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;

    return (
        <TextField fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
            }}
            {...other}
        />
    );
}

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
    return (
        <MenuItem selected={isHighlighted} component='div'>
            <div>
                <Highlighter
                    highlightClassName='hightlight'
                    searchWords={[query]}
                    autoEscape={true}
                    textToHighlight={suggestion.name}
                />
            </div>
        </MenuItem>
    );
}

const getSuggestionValue = (suggestion) => {
	console.log('paf')
    return suggestion.name;
}

export {renderInputComponent, renderSuggestion, getSuggestionValue};