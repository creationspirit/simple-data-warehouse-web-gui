import { SELECT_FACT_TABLE } from '../actions';

export default function(state = {}, action) {
    switch (action.type) {
        case SELECT_FACT_TABLE:
            return action.payload;
        default:
            return state;
    }
}
