export interface IPageNavigationStoreOptions {
    pageSize: number;
    page?: number;
    hasMore?: boolean;
    nextPage: number;
    prevPage: number;
}
class PageNavigationStore {
    private _nextPage: number;
    private _prevPage: number;
    private _more: boolean | number = null;

    private _page: number;
    private _pageSize: number;
    private _hasMore: boolean;

    constructor(cfg: IPageNavigationStoreOptions) {
        this._page = cfg.page || 0;
        this._prevPage = this._page - 1;
        this._nextPage = this._page + 1;

        if (!cfg.pageSize) {
            this._pageSize = cfg.pageSize;
        } else {
            throw new Error('Option pageSize is undefined in PagePagination');
        }

        this._hasMore = cfg.hasMore || true;
    }

    getParams(): IPageNavigationStoreOptions {
        return {
            page: this._page,
            pageSize: this._pageSize,
            hasMore: this._hasMore,
            prevPage: this._prevPage,
            nextPage: this._nextPage
        };
    }
}

export default PageNavigationStore;
