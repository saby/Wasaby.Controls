import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGrid/ItemTemplate/WithPhoto/TwoLevelsWithoutPhoto/TwoLevelsWithoutPhoto';
import {Memory} from 'Types/source';
import {Gadgets} from '../../../DemoHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { TExpandOrColapsItems } from 'Controls-demo/types';

export default class extends Control<IControlOptions> {
   protected _template: TemplateFunction = Template;
   protected _viewSource: Memory;
   // tslint:disable-next-line
   protected _expandedItems: TExpandOrColapsItems = [1, 2, 4];
   protected _twoLvlColumnsNoPhoto: IColumn[] = Gadgets.getGridTwoLevelColumnsWithPhoto().map((cur) => ({
      ...cur, template: undefined
   }));

   protected _beforeMount(options: IControlOptions): void {
      if (options.hasOwnProperty('collapseNodes')) {
         this._expandedItems = [];
      }
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: Gadgets.getDataTwoLvl()
      });
   }

   static _styles: string[] = ['Controls-demo/treeGrid/ItemTemplate/WithPhoto/styles', 'Controls-demo/Controls-demo'];
}
