import {Record} from 'Types/entity';
import {IControlOptions} from 'UI/Base';

export interface IBreadCrumbsOptions extends IControlOptions {
    items: Record[];
    keyProperty: string;
    parentProperty: string;
    displayProperty: string;
}
