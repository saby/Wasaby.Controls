import {TNavigationDirection} from 'Controls/_interface/INavigation';

type TMore = boolean | number;

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
    private _more: TMore = null;

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

        this._hasMore = !!cfg.hasMore;
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

    setMetaMore(more: TMore): void {
        this._more = more;
    }

    hasMoreData(direction: TNavigationDirection): boolean {
        let result: boolean;

        if (direction === 'forward') {

            // moreResult === undefined, when navigation for passed rootKey is not defined
            if (this._more === undefined) {
                result = false;
            } else {
                if (this._hasMore === false) {
                    // в таком случае в more приходит общее число записей в списке
                    // значит умножим номер след. страницы на число записей на одной странице и сравним с общим
                    result = typeof this._more === 'boolean'
                                ? this._more
                                : this._nextPage * this._pageSize < this._more;
                } else {
                    result = !!this._more;
                }
            }
        } else if (direction === 'backward') {
            result = this._prevPage >= 0;
        } else {
            throw new Error('Parameter direction is not defined in hasMoreData call');
        }

        return result;
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
