import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/VirtualScroll/Default/Default"
import {Memory} from "Types/source"
import {generateData} from "../../../list_new/DemoHelpers/DataCatalog";
import 'css!Controls-demo/Controls-demo';
import {getCountriesStats} from '../../DemoHelpers/DataCatalog';

export default class extends Control {
   protected _template: TemplateFunction = Template;
   private _viewSource: Memory;
   private _columns = getCountriesStats().getColumnsWithoutWidths();

   private dataArray = generateData({
      keyProperty: 'id',
      count: 1000,
      beforeCreateItemCallback: item => {
         item.populationDensity = `Запись с ключом ${item.id}.`;
         item.number = `Запись с ключом ${item.id}.`;
         item.country = `Запись с ключом ${item.id}.`;
         item.capital = `Запись с ключом ${item.id}.`;
         item.population = `Запись с ключом ${item.id}.`;
         item.square = `Запись с ключом ${item.id}.`;
      }
   });

   protected _beforeMount() {
      this._viewSource = new Memory({
         keyProperty: 'id',
         data: this.dataArray
      });
   }
}
