import { FETCH_DIMENSIONS } from '../actions';

export default function(state = {}, action) {
    switch (action.type) {
        case FETCH_DIMENSIONS:
            return action.payload.data;
        default:
            return state;
    }
}
