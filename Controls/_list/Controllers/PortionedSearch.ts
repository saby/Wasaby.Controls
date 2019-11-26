const MAX_SEARCH_DURATION = 10000;
const SEARCH_STATES = {
  NOT_STARTED: null,
  STARTED: 'started',
  STOPPED: 'stopped',
  CONTINUED: 'continued'
};

type SearchState = null | 'started' | 'stopped' | 'continued';

export interface IPortionedSearchOptions {
    searchStopCallback: Function;
    searchResetCallback: Function;
    searchContinueCallback: Function;
    searchAbortCallback: Function;
}

export default class PortionedSearch<PortionedSearchOptions> {
    protected _searchTimer: number = null;
    protected _searchState: SearchState = null;
    protected _options: IPortionedSearchOptions = null;

    constructor(constructorOptions: IPortionedSearchOptions) {
        this._options = constructorOptions;
    }

    startSearch(): void {
        if (this._getSearchState() === SEARCH_STATES.NOT_STARTED) {
            this._setSearchState(SEARCH_STATES.STARTED);
            this._startTimer();
        }
    }

    abortSearch(): void {
        this._setSearchState(SEARCH_STATES.STOPPED);
        this._clearTimer();
        this._options.searchAbortCallback();
    }

    reset(): void {
        this._setSearchState(SEARCH_STATES.NOT_STARTED);
        this._clearTimer();
        this._options.searchResetCallback();
    }

    shouldSearch(): boolean {
        return this._getSearchState() !== SEARCH_STATES.STOPPED;
    }

    continueSearch(): void {
        this._setSearchState(SEARCH_STATES.CONTINUED);
        this._options.searchContinueCallback();
    }

    private _startTimer(): void {
        this._searchTimer = setTimeout(() => {
            this._setSearchState(SEARCH_STATES.STOPPED);
            this._options.searchStopCallback();
        }, MAX_SEARCH_DURATION);
    }

    private _clearTimer(): void {
        if (this._searchTimer) {
            clearTimeout(this._searchTimer);
            this._searchTimer = null;
        }
    }

    private _setSearchState(state: SearchState): void {
        this._searchState = state;
    }

    private _getSearchState(): SearchState {
        return this._searchState;
    }
}
