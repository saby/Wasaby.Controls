/**
 * Модуль для работы с группировкой в списочных контролах.
 * @author Авраменко А.С.
 * @private
 */

import {QueryWhere} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {ICrud} from 'Types/source';

export type TGroupId = string|number;
export type TArrayGroupId = TGroupId[];

interface IGroupingCollection {
    setGroupProperty: () => void;
    getGroupProperty: () => string;
}

export interface IGroupingModel extends IGroupingCollection {
    toggleGroup: (groupId: TGroupId, state?: boolean) => void;
    getCollapsedGroups: () => TArrayGroupId;
    setCollapsedGroups: (arrayGroupId: TArrayGroupId) => void;
    isGroupExpanded: (groupId: TGroupId) => boolean;
    isAllGroupsCollapsed: () => boolean;
    mergeItems: (items: RecordSet) => void;
}

export function toggleGroup(collection: IGroupingModel,
                            groupId: TGroupId,
                            groupingLoader: any,
                            source: ICrud,
                            filter: QueryWhere,
                            sorting?: object): void {
    const needExpandGroup = !collection.isGroupExpanded(groupId);
    if (needExpandGroup && !groupingLoader.isLoadedGroup(groupId)) {
        groupingLoader.loadGroup(collection, groupId, source, filter, sorting).then(() => {
            collection.toggleGroup(groupId);
        });
    } else {
        collection.toggleGroup(groupId);
    }
}

export function setCollapsedGroups(collection: IGroupingModel, arrayGroupId: TArrayGroupId): void {
    collection.setCollapsedGroups(arrayGroupId);
}

export function isAllGroupsCollapsed(collection: IGroupingModel): boolean {
    return collection.isAllGroupsCollapsed();
}

export function prepareFilterCollapsedGroups(collapsedGroups: TArrayGroupId, filter: QueryWhere): QueryWhere {
    if (collapsedGroups) {
        filter.collapsedGroups = collapsedGroups;
    }
    return filter;
}
