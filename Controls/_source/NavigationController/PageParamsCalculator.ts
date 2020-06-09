import {IAdditionalQueryParams, Direction} from 'Controls/_interface/IAdditionalQueryParams';
import {QueryNavigationType} from 'Types/source';
import {PageNavigationStore, IPageNavigationStoreOptions} from './NavigationController/PageNavigationStore';
import {IBasePageSourceConfig} from 'Controls/interface';
import {TNavigationDirection} from 'Controls/_interface/INavigation';
import {Recordset} from 'Types/collection';

class PageParamsCalculator {
    static getQueryParams(
        store: PageNavigationStore,
        config: IBasePageSourceConfig,
        direction?: TNavigationDirection
    ): IAdditionalQueryParams {
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

    static updateQueryProperties(
        store: PageNavigationStore,
        list: Recordset,
        config: IBasePageSourceConfig,
        direction?: TNavigationDirection
    ): IPageNavigationStoreOptions  {
        const moreValue = list.getMetaData().more;
        const storeParams = store.getParams();

        PageParamsCalculator._validateNavigation(moreValue, storeParams.hasMore);

        switch (direction) {
            case 'forward': store.shiftNextPage(); break;
            case 'backward': store.shiftPrevPage(); break;
            default: {
                // Если направление не указано,
                // значит это расчет параметров после начальной загрузки списка или после перезагрузки
                if (config) {
                    // TODO обработать эту ситуацию
                    const pageSizeRemainder = config.pageSize % storeParams.pageSize;
                    const pageSizeCoef = (config.pageSize - pageSizeRemainder) / storeParams.pageSize;

                    if (pageSizeRemainder) {
                        throw new Error('pageSize, переданный для единичной перезагрузки списка, должен нацело делиться на pageSize из опции navigation.sourceConfig.');
                    }

                    // если мы загрузили 0 страницу размера 30 , то мы сейчас на 2 странице размера 10
                    store.setCurrentPage((config.page + 1) * pageSizeCoef - 1);
                }
            }
        }
        return store.getParams();
    }

    private static _validateNavigation(hasMoreValue: boolean | number, hasMoreOption: boolean): void {
        if (hasMoreOption === false) {
            // meta.more can be undefined is is not error
            if (hasMoreValue && (typeof hasMoreValue !== 'number')) {
                throw new Error('"more" Parameter has incorrect type. Must be numeric');
            }
        } else {
            // meta.more can be undefined is is not error
            if (hasMoreValue && (typeof hasMoreValue !== 'boolean')) {
                throw new Error('"more" Parameter has incorrect type. Must be boolean');
            }
        }
    }
}

export default PageParamsCalculator;
