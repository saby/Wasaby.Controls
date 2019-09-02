import {RecordSet} from 'Types/Collection';
import {Record} from 'Types/entity';
import {IPrefetchHistoryParams, IPrefetchParams} from './IPrefetch';

const PREFETCH_SESSION_ERROR = '00000000-0000-0000-0000-000000000000';
const PREFETCH_SESSION_FIELD = 'PrefetchSessionId';
const PREFETCH_DATA_VALID_FIELD = 'PrefetchDataValidUntil';

function isPrefetchParamsValid(items: RecordSet): boolean {
    const sessionId = getSessionId(items);
    return sessionId && sessionId !== PREFETCH_SESSION_ERROR;
}

function getPrefetchMeta(items: RecordSet): Record {
    return items.getMetaData().results;
}

function getSessionId(items: RecordSet): string {
    return getPrefetchMeta(items).get(PREFETCH_SESSION_FIELD);
}

function getDataValid(items: RecordSet): Date {
    return getPrefetchMeta(items).get(PREFETCH_DATA_VALID_FIELD);
}

function getPrefetchFromHistory({prefetchParams}): IPrefetchHistoryParams|undefined {
    return prefetchParams;
}

function addPrefetchToHistory<T>(history: T, prefetchParams: IPrefetchHistoryParams|undefined): T {
    if (history) {
        history.prefetchParams = prefetchParams;
    }
    return history;
}

function getPrefetchParamsForSave(items: RecordSet): IPrefetchHistoryParams|undefined {
    if (isPrefetchParamsValid(items)) {
        return {
            PrefetchSessionId: getSessionId(items),
            PrefetchDataValidUntil: getDataValid(items)
        };
    }
}

function applyPrefetchFromHistory(filter: object, history): object {
    const prefetchParams = getPrefetchFromHistory(history);
    let resultFilter;

    if (prefetchParams) {
        resultFilter = {...filter};
        resultFilter[PREFETCH_SESSION_FIELD] = prefetchParams[PREFETCH_SESSION_FIELD];
    } else {
        resultFilter = filter;
    }

    return resultFilter;
}

function applyPrefetchFromItems(filter: object, items: RecordSet): object {
    const sessionId = getSessionId(items);

    if (sessionId) {
        filter[PREFETCH_SESSION_FIELD] = sessionId;
    }

    return  filter;
}

function prepareFilter(filter: Object, prefetchParams: IPrefetchParams): object {
    const clonedFiled = {...filter};
    return {...clonedFiled, ...prefetchParams || {}};
}

function needInvalidatePrefetch(history): boolean {
    const prefetchParams = getPrefetchFromHistory(history);
    return prefetchParams[PREFETCH_DATA_VALID_FIELD] < new Date();
}

function clearPrefetchSession(filter: object): object {
    const resultFilter = filter;
    delete filter[PREFETCH_SESSION_FIELD];
    return resultFilter;
}

export {
    applyPrefetchFromItems,
    applyPrefetchFromHistory,
    getPrefetchParamsForSave,
    addPrefetchToHistory,
    needInvalidatePrefetch,
    prepareFilter,
    clearPrefetchSession
};
