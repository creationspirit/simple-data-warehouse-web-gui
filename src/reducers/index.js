import { combineReducers } from 'redux';
import factTableReducer from './reducer-factTable';
import dimensionsReducer from './reducer-dimensions';
import measuresReducer from './reducer-measures';
import selectedFactTableReducer from './reducer-selectedFactTable'
import resultReducer from './reducer-result.js';

const rootReducer = combineReducers({
    factTables: factTableReducer,
    selectedFactTable: selectedFactTableReducer,
    dimensions: dimensionsReducer,
    measures: measuresReducer,
    queryResult: resultReducer
});

export default rootReducer;
