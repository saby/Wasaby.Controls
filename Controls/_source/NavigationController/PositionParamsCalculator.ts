import {IAdditionalQueryParams, Direction} from 'Controls/_interface/IAdditionalQueryParams';
import {QueryNavigationType} from 'Types/source';
import {PositionNavigationStore, IPositionNavigationState} from './NavigationController/PositionNavigationStore';
import {IBasePositionSourceConfig, INavigationPositionSourceConfig} from 'Controls/interface';
import {TNavigationDirection} from 'Controls/_interface/INavigation';
import {Recordset} from 'Types/collection';
import {CursorDirection} from 'Controls/Constants';

// TODO Общие типы
type TPosition = any;
/**
 * Позиция, от которой нужно начинать скролл
 * Является массивом из любых типов (number, date, string и тд)
 */
type TPositionValue = any[];
type TField = string | string[];
type TFieldValue = string[];

class PositionParamsCalculator {
    static getQueryParams(
        store: PositionNavigationStore,
        config: INavigationPositionSourceConfig,
        direction?: TNavigationDirection
    ): IAdditionalQueryParams {
        const addParams: IAdditionalQueryParams = {};
        addParams.meta = {navigationType: QueryNavigationType.Position};

        const storeParams = store.getParams();

        const queryField = this._resolveField(storeParams.field);

        let queryPosition;
        switch (direction) {
            case 'forward': queryPosition = storeParams.forwardPosition; break;
            case 'backward': queryPosition = storeParams.backwardPosition; break;
            default: queryPosition = config.position ? config.position : storeParams.position;
        }

        const queryDirection = PositionParamsCalculator._resolveDirection(direction, storeParams.direction);
        let sign;
        switch (queryDirection) {
            case CursorDirection.forward:
                sign = '>=';
                break;
            case CursorDirection.backward:
                sign = '<=';
                break;
            case CursorDirection.bothways:
                sign = '~';
                break;
        }

        const additionalFilter = {};
        for (let i = 0; i < queryField.length; i++) {
            additionalFilter[queryField[i] + sign] = queryPosition[i];
        }
        addParams.filter = additionalFilter;
        // TODO callback
        // TODO lastpage

        return addParams;
    }

    static updateQueryProperties(
        store: PositionNavigationStore,
        list: Recordset,
        config: IBasePageSourceConfig,
        direction?: TNavigationDirection
    ): IPositionNavigationState  {
        const moreValue = list.getMetaData().more;
        const storeParams = store.getParams();

        PositionParamsCalculator._validateNavigation(moreValue, storeParams.hasMore);
        store.setMetaMore(moreValue);

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

    private static _resolveDirection(
        loadDirection: TNavigationDirection,
        optDirection: CursorDirection
    ): CursorDirection {
        let navDirection: CursorDirection;
        if (loadDirection === 'forward') {
            navDirection = CursorDirection.forward;
        } else if (loadDirection === 'backward') {
            navDirection = CursorDirection.backward;
        } else {
            navDirection = optDirection;
        }
        return navDirection;
    }

    private static _resolveField(optField: TField): TFieldValue {
        return (optField instanceof Array) ? optField : [optField];
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

export default PositionParamsCalculator;
