import Context = require('Core/DataContext');

export default class SearchStore extends Context {
    state: any = null;

    constructor(state: any, dispatcher: IDispatcher) {
        super(Context);
        this.state = state;
        this._registerToActions = this._registerToActions.bind(this);
        dispatcher.register(this._registerToActions);
    }

    get searchValue(): string {
        return this.state.searchValue;
    }

    private _registerToActions(action): void {
        switch (action.type) {
            case 'UPDATE_SEARCH_VALUE': {
                this._searchValueChangedCallback(action.payload.searchValue);
            }
        }
    }

    private _searchValueChangedCallback(searchValue: string): void {
        this.state.searchValue = searchValue;
        this.updateConsumers();
    }
}
