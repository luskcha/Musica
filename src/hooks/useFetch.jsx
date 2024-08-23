import { useReducer } from 'react';

const ACTIONS = {
	FETCH_INIT: 'FETCH_INIT',
	FETCH_SUCCESS: 'FETCH_SUCCESS',
	FETCH_FAILURE: 'FETCH_FAILURE',
};

function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.FETCH_INIT:
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case ACTIONS.FETCH_SUCCESS:
			return {
				...state,
				data: action.payload,
				isLoading: false,
				isError: false,
			};
		case ACTIONS.FETCH_FAILURE:
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		default:
			return state;
	}
}

function useFetch(url, options = {}) {
	const [state, dispatch] = useReducer(reducer, {
		data: null,
		isLoading: false,
		isError: false,
	});

	function doFetch(newOptions = {}) {
		dispatch({ type: ACTIONS.FETCH_INIT });

		fetch(url, { ...options, ...newOptions })
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Error al realizar la petición');
			})
			.then((data) => {
				dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
			})
			.catch(() => {
				dispatch({ type: ACTIONS.FETCH_FAILURE });
			});
	}

	return [state, doFetch];
}

export default useFetch;
