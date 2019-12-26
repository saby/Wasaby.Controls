/**
 * Менеджер для работы с группировкой в списочных контролах.
 * @author Авраменко А.С.
 * @private
 */

import {QueryWhere} from 'Types/source';
import {RecordSet} from 'Types/collection';

export type TGroupId = string|number;
export type TArrayGroupId = TGroupId[];

interface IGroupingCollection {
    setGroupProperty: () => void;
    getGroupProperty: () => string;
}

interface IGroupingModel extends IGroupingCollection {
    toggleGroup: (groupId: TGroupId, state?: boolean) => void;
    getCollapsedGroups: () => TArrayGroupId;
    setCollapsedGroups: (arrayGroupId: TArrayGroupId) => void;
    resetLoadedGroups: () => void;
    isGroupLoaded: (groupId: TGroupId) => boolean;
    isGroupExpanded: (groupId: TGroupId) => boolean;
    isAllGroupsCollapsed: () => boolean;
    mergeItems: (items: RecordSet) => void;
}

function loadGroup(collection: IGroupingModel,
                   groupId: TGroupId,
                   sourceController: any,
                   filter: QueryWhere,
                   sorting?: object): Promise<void> {
    const queryFilter = {
        loadingGroups: [groupId],
        ...filter
    };
    return sourceController.load(queryFilter, sorting).then((loadedItems: RecordSet) => {
        collection.mergeItems(loadedItems);
    });
}

export function toggleGroup(collection: IGroupingModel,
                            groupId: TGroupId,
                            useNewGrouping: boolean,
                            sourceController: any,
                            filter: QueryWhere,
                            sorting?: object): void {
    if (!useNewGrouping) {
        collection.toggleGroup(groupId);
    }
    const needExpandGroup = !collection.isGroupExpanded(groupId);
    if (needExpandGroup && !collection.isGroupLoaded(groupId)) {
        loadGroup(collection, groupId, sourceController, filter, sorting).then(() => {
            collection.toggleGroup(groupId);
        });
    }
}

export function setCollapsedGroups(collection: IGroupingModel, arrayGroupId: TArrayGroupId): void {
    collection.setCollapsedGroups(arrayGroupId);
}

export function resetLoadedGroups(collection: IGroupingModel): void {
    collection.resetLoadedGroups();
}

export function isAllGroupsCollapsed(collection: IGroupingModel): boolean {
    return collection.isAllGroupsCollapsed();
}

export function prepareFilterCollapsedGroups(groupProperty: string,
                                             collapsedGroups: TArrayGroupId,
                                             filter: QueryWhere): QueryWhere {
    if (collapsedGroups) {
        filter[groupProperty] = collapsedGroups;
    }
    return filter;
}
