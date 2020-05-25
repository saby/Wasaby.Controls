import {IAdditionalQueryParams, Direction} from 'Controls/_interface/IAdditionalQueryParams';
import {QueryNavigationType} from 'Types/source';
import PageNavigationStore from 'Controls/_source/NavigationController/PageNavigationStore';
import {IBasePageSourceConfig} from 'Controls/interface';
import {TNavigationDirection} from 'Controls/_interface/INavigation';

const PageParamsCalculator = {
    getQueryParams(store: PageNavigationStore,
                   config: IBasePageSourceConfig,
                   direction?: TNavigationDirection): IAdditionalQueryParams {
        const addParams: IAdditionalQueryParams = {};
        addParams.meta = {navigationType: QueryNavigationType.Page};

        const storeParams = store.getParams();

        let page;
        switch (direction) {
            case 'forward': page = storeParams.nextPage; break;
            case 'backward': page = storeParams.prevPage; break;
            default: page = config.page ? config.page : storeParams.page;
        }
        const pageSize = config.pageSize ? config.pageSize : storeParams.pageSize;

        addParams.offset = page * pageSize;
        addParams.limit = pageSize;

        if (storeParams.hasMore === false) {
            addParams.meta.hasMore = false;
        }

        return addParams;
    }
}

export default PageParamsCalculator;
