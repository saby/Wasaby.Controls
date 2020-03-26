export function startSearch (payload, dispatcher) {
    Promise.resolve().then(() => {
        dispatcher.dispatch({
            type: 'UPDATE_SEARCH_VALUE',
            payload: {
                searchValue: payload.searchValue
            }
        });
    });
}
