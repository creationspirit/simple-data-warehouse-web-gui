import axios from 'axios';

export const FETCH_FACT_TABLES = 'fetch-fact-tables';
export const FETCH_MEASURES = 'fetch-measures';
export const FETCH_DIMENSIONS = 'fetch-dimensions';
export const SUBMIT_CONTENT = 'submit-content';
export const SELECT_FACT_TABLE = 'select-fact-table';

const ROOT_URL = 'http://localhost:3004';
const FACT_TABLES_URL = `${ROOT_URL}/fact-tables`;
const MEASURES_URL = `${ROOT_URL}/measures`;
const DIMENSIONS_URL = `${ROOT_URL}/dimensions`;
const SUBMIT_URL = `${ROOT_URL}/submit`;

export const fetchFactTable = () => {
    const payload = axios.get(FACT_TABLES_URL);
    return {
        type: FETCH_FACT_TABLES,
        payload
    };
}

export const fetchMeasures = (tableId) => {
    const payload = axios.get(`${MEASURES_URL}/${tableId}`);
    return {
        type: FETCH_MEASURES,
        payload
    };
}

export const fetchDimensions = (tableId) => {
    const payload = axios.get(`${DIMENSIONS_URL}/${tableId}`);
    return {
        type: FETCH_DIMENSIONS,
        payload
    };
}

export const selectFactTable = (tableId) => {
    return {
        type: SELECT_FACT_TABLE,
        payload: tableId
    }
}

export const postSelected = (factTable, measures, dimensions) => {
    console.log(factTable, dimensions, measures)
    const payload = axios.post(
            SUBMIT_URL,
            {
                factTable,
                measures,
                dimensions
            });
    return {
        type: SUBMIT_CONTENT,
        payload
    };
}
