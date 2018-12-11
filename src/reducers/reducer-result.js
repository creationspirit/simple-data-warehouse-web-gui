import { SUBMIT_CONTENT } from '../actions';

export default function(state = {}, action) {
    switch (action.type) {
        case SUBMIT_CONTENT:
            return action.payload.data;
        default:
            return state;
    }
}
