import _ from 'lodash';

import { FETCH_FACT_TABLES } from '../actions';

export default function(state = {}, action) {
    switch (action.type) {
        case FETCH_FACT_TABLES:
            return _.mapKeys(action.payload.data, 'sifTablica');
        default:
            return state;
    }
}
