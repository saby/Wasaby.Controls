import {IAdditionalQueryParams, Direction} from 'Controls/_interface/IAdditionalQueryParams';
import {QueryNavigationType} from 'Types/source';
import {PositionNavigationStore, IPositionNavigationState} from './NavigationController/PositionNavigationStore';
import {IBasePositionSourceConfig, INavigationPositionSourceConfig} from 'Controls/interface';
import {TNavigationDirection} from 'Controls/_interface/INavigation';
import {Recordset} from 'Types/collection';
import {CursorDirection} from 'Controls/Constants';
import {Logger} from 'UI/Utils';

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
        config: IBasePositionSourceConfig,
        direction?: TNavigationDirection
    ): IPositionNavigationState  {
        const moreValue = list.getMetaData().more;
        const storeParams = store.getParams();

        const queryDirection = PositionParamsCalculator._resolveDirection(direction, storeParams.direction);

        if (typeof moreValue === 'boolean') {
            if (queryDirection !== CursorDirection.bothways) {
                store.updateMoreToDirection(direction, moreValue);
            } else {
                Logger.error('NavigationController: Wrong type of \"more\" value. Must be Object');
            }
        } else {
            if (moreValue instanceof Object) {
                if (queryDirection === CursorDirection.bothways) {
                    store.setMoreData(moreValue);
                } else {
                    Logger.error('NavigationController: Wrong type of \"more\" value. Must be boolean');
                }
            }
        }

        const metaNextPosition = list.getMetaData().nextPosition;

        if (metaNextPosition) {
            if (metaNextPosition instanceof Array) {
                if (queryDirection !== CursorDirection.bothways) {
                    if (queryDirection === CursorDirection.forward) {
                        store.setForwardPosition(metaNextPosition);
                    } else if (queryDirection === CursorDirection.backward) {
                        store.setBackwardPosition(metaNextPosition);
                    }
                } else {
                    Logger.error('NavigationController: Wrong type of \"nextPosition\" value. Must be object');
                }
            } else {
                if (queryDirection === CursorDirection.bothways) {
                    if (metaNextPosition.before && metaNextPosition.before instanceof Array
                        && metaNextPosition.after && metaNextPosition.after instanceof Array) {
                        this._beforePosition = metaNextPosition.before;
                        this._afterPosition = metaNextPosition.after;
                        this._positionByMeta = true;
                    } else if (metaNextPosition.backward && metaNextPosition.backward instanceof Array
                        && metaNextPosition.forward && metaNextPosition.forward instanceof Array) {
                        this._beforePosition = metaNextPosition.backward;
                        this._afterPosition = metaNextPosition.forward;
                        this._positionByMeta = true;
                    } else {
                        Logger.error('QueryParamsController/Position: ' +
                            'Wrong type of \"nextPosition\" value. Must be Object width `before` and `after` properties.' +
                            'Each properties must be Arrays');
                    }
                } else {
                    Logger.error('QueryParamsController/Position: Wrong type of \"nextPosition\" value. Must be Array');
                }
            }

        } else {
            if ((list as RecordSet).getCount()) {
                if (loadDirection !== 'down') {
                    edgeElem = (list as RecordSet).at(0);
                    this._beforePosition = this._resolvePosition(edgeElem, this._options.field);
                }
                if (loadDirection !== 'up') {
                    edgeElem = (list as RecordSet).at((list as RecordSet).getCount() - 1);
                    this._afterPosition = this._resolvePosition(edgeElem, this._options.field);
                }
            }
        }

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

}

export default PositionParamsCalculator;
