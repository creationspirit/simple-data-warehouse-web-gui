import { FETCH_MEASURES } from '../actions';

export default function(state = {}, action) {
    switch (action.type) {
        case FETCH_MEASURES:
            return action.payload.data;
        default:
            return state;
    }
}
