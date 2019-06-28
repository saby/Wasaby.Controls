import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {descriptor as EntityDescriptor} from 'Types/entity';
import {IoC} from 'Env/Env';
import barTemplate = require('wml!Controls/_progress/Bar/Bar');

export interface IBarOptions extends IControlOptions {
   value?: number;
}
/**
 * Control that renders progress bar
 * @class Controls/_progress/Bar
 * @extends Core/Control
 * @author Колесов В.А.
 *
 * @public
 *
 * @demo Controls-demo/Indicator/ProgressBar/ProgressBar
 *
 * @css @color-ProgressBar__bar Progress bar background color
 * @css @height-ProgressBar_bar Progress bar height
 * @css @color-ProgressBar__progress Progress bar fill color
 */
/**
 * @name Controls/_progress/Bar#value
 * @cfg {Number} Progress in percents (ratio of the filled part)
 * @remark
 * An integer from 1 to 100.
 */
class Bar extends Control<IBarOptions> {
   // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
   protected _template: TemplateFunction = barTemplate;
   protected _width: string = '0px';

   private _getWidth(val: number): string {
      const maxPercentValue = 100;
      if (val < 0 || val > maxPercentValue) {
         IoC.resolve('ILogger').error('Bar', 'The value must be in range of [0..100]');
      }
      return (val > 0 ? Math.min(val, maxPercentValue) + '%' : '0px');
   }

   protected _beforeMount(opts: IBarOptions): void {
      this._width = this._getWidth(opts.value);
   }

   protected _beforeUpdate(opts: IBarOptions): void {
      this._width = this._getWidth(opts.value);
   }

   static _theme: string[] = ['Controls/progress'];

   static getDefaultOptions(): object {
      return {
         theme: 'default',
         value: 0
      };
   }

   static getOptionTypes(): object {
      return {
         value: EntityDescriptor(Number).required()
      };
   }
}

export default Bar;
