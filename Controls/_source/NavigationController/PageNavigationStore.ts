export interface IPageNavigationStoreOptions {
    pageSize: number;
    page?: number;
    hasMore?: boolean;
}
export interface IPageNavigationState {
    pageSize: number;
    page?: number;
    hasMore?: boolean;
    nextPage: number;
    prevPage: number;
}
class PageNavigationStore {
    private _page: number;
    private _pageSize: number;
    private _hasMore: boolean;

    private _nextPage: number;
    private _prevPage: number;
    private _more: boolean | number = null;

    constructor(cfg: IPageNavigationStoreOptions) {
        this._page = cfg.page || 0;
        this._prevPage = this._page - 1;
        this._nextPage = this._page + 1;
        this._initPages(cfg.page || 0);

        if (cfg.pageSize) {
            this._pageSize = cfg.pageSize;
        } else {
            throw new Error('Option pageSize is undefined in PagePagination');
        }

        this._hasMore = cfg.hasMore || true;
    }

    private _initPages(pageNumber: number): void {
        this._page = pageNumber;
        this._prevPage = this._page - 1;
        this._nextPage = this._page + 1;
    }

    getParams(): IPageNavigationState {
        return {
            page: this._page,
            pageSize: this._pageSize,
            hasMore: this._hasMore,
            prevPage: this._prevPage,
            nextPage: this._nextPage
        };
    }

    shiftNextPage(): void {
        this._nextPage++;
    }

    shiftPrevPage(): void {
        this._prevPage--;
    }

    setCurrentPage(pageNumber: number): void {
        this._initPages(pageNumber);
    }

    setMetaMore(more: boolean | number): void {
        this._more = more;
    }

    destroy(): void {
        this._nextPage = null;
        this._prevPage = null;
        this._more = null;

        this._page = null;
        this._pageSize = null;
        this._hasMore = null;
    }
}

export default PageNavigationStore;
