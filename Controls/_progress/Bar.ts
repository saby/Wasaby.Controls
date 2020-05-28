import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {descriptor as EntityDescriptor} from 'Types/entity';
import {Logger} from 'UI/Utils';
import barTemplate = require('wml!Controls/_progress/Bar/Bar');

export interface IBarOptions extends IControlOptions {
   value?: number;
}
/**
 * Базовый индикатор выполнения процесса.
 * Отображает полосу прогресса выполнения.
 * 
 * @remark
 * Полезные ссылки:
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_progress.less">переменные тем оформления</a>
 * 
 * @class Controls/_progress/Bar
 * @extends Core/Control
 * @author Колесов В.А.
 *
 * @public
 *
 * @demo Controls-demo/progress/Bar/Index
 *
 */

/*
 * Control that renders progress bar
 * @class Controls/_progress/Bar
 * @extends Core/Control
 * @author Колесов В.А.
 *
 * @public
 *
 * @demo Controls-demo/progress/Bar/Index
 *
 */

/**
 * @name Controls/_progress/Bar#value
 * @cfg {Number} Значение прогресса в процентах.
 * @remark
 * Целое число от 1 до 100.
 */

/*
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
         Logger.error('Bar: The value must be in range of [0..100]', this);
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
