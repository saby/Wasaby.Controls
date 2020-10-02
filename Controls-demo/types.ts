import { IHeaderCell } from 'Controls/_grid/interface/IHeaderCell';
import {RecordSet} from 'Types/collection';
import {TemplateFunction} from 'UI/Base';

export interface IHeader extends IHeaderCell {
    title: string;
}

export type TItemsReadyCallback = (items: RecordSet) => void;
export type TRoot = string | number | null;

export type TExpandOrColapsItems = number[] | null[];

export interface INavigation {
    source: string;
    view: string;
    sourceConfig: {
        pageSize: number;
        page: number;
        hasMore?: boolean;
    };
    viewConfig?: {
        pagingMode?: string;
        maxCountValue?: number;
    };
}

export interface IColumn {
    width: string;
    displayProperty?: string;
    compatibleWidth?: string;
    template?: TemplateFunction;
    resultTemplate?: TemplateFunction;
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'center' | 'bottom' | 'baseline';
    stickyProperty?: string;
    textOverflow?: 'ellipsis' | 'none';
    columnSeparatorSize?: {
        left: 's' | null,
        right: 's' | null
    };
    cellPadding?: {
        left: 'S' | 'M' | 'null',
        right: 'S' | 'M' | 'null'
    };
}
