import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Tile/ItemsContainerPadding/ItemsContainerPadding';
import {Gadgets} from '../DataHelpers/DataCatalog';
import {HierarchicalMemory} from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
