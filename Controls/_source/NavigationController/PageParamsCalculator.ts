import {IAdditionalQueryParams, Direction} from 'Controls/_interface/IAdditionalQueryParams';
import {QueryNavigationType} from 'Types/source';
import PageNavigationStore from 'Controls/_source/NavigationController/PageNavigationStore';
import { IBasePageSourceConfig } from 'Controls/interface';

export default {
    getQueryParams(store: PageNavigationStore, config: IBasePageSourceConfig): IAdditionalQueryParams {
        const addParams: IAdditionalQueryParams = {};
        addParams.meta = {navigationType: QueryNavigationType.Page};

        const storeParams = store.getParams();
        const page = config.page ? config.page : storeParams.page;
        const pageSize = config.pageSize ? config.pageSize : storeParams.pageSize;
        addParams.offset = page * pageSize;
        addParams.limit = pageSize;

        if (storeParams.hasMore === false) {
            addParams.meta.hasMore = false;
        }

        return addParams;
    },

    getQueryParamsForward(store: PageNavigationStore, config: IBasePageSourceConfig): IAdditionalQueryParams {
        const addParams: IAdditionalQueryParams = {};
        addParams.meta = {navigationType: QueryNavigationType.Page};

        const storeParams = store.getParams();
        const page = storeParams.nextPage;
        const pageSize = config.pageSize ? config.pageSize : storeParams.pageSize;
        addParams.offset = page * pageSize;
        addParams.limit = pageSize;

        if (this._options.hasMore === false) {
            addParams.meta.hasMore = false;
        }

        return addParams;
    },

    getQueryParamsBackward(store: PageNavigationStore, config: IBasePageSourceConfig): IAdditionalQueryParams {
        const addParams: IAdditionalQueryParams = {};
        addParams.meta = {navigationType: QueryNavigationType.Page};

        const storeParams = store.getParams();
        const page = storeParams.prevPage;
        const pageSize = config.pageSize ? config.pageSize : storeParams.pageSize;
        addParams.offset = page * pageSize;
        addParams.limit = pageSize;

        if (this._options.hasMore === false) {
            addParams.meta.hasMore = false;
        }

        return addParams;
    }

    _getQueryParamsCommon() {
        const addParams: IAdditionalQueryParams = {};
        addParams.meta = {navigationType: QueryNavigationType.Page};
    }
}