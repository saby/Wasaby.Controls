import {IoC} from 'Env/Env';
import {Control, IControlOptions} from 'UI/Base';
import {descriptor as EntityDescriptor} from 'Types/entity';
import {ICaption, ICaptionOptions} from 'Controls/interface';
import LabelTemplate = require('wml!Controls/_input/Label/Label');

export interface ILabelOptions extends IControlOptions, ICaptionOptions {
   required?: boolean;
   underline?: string | null;
}
      /**
       * Label.
       *
       * @class Controls/_input/Label
       * @extends Core/Control
       *
       * @mixes Controls/_interface/ICaption
       *
       * @public
       * @demo Controls-demo/Label/Label
       *
       * @author Михайловский Д.С.
       */

      /**
       * @name Controls/_input/Label#required
       * @cfg {Boolean} Determines whether the label can be displayed as required.
       */

      /**
       * @name Controls/_input/Label#underline
       * @cfg {String} Display underline style of the label.
       * @variant hovered
       * @variant fixed
       * @variant none
       */

      /**
       * @name Controls/_input/Label#href
       * @cfg {String} Contains a URL or a URL fragment that the hyperlink points to.
       */

      var _private = {
         warn: function(container, className, optionValue) {
            if (container.classList.contains(className)) {
               Env.IoC.resolve('ILogger').warn('Controls/Label', 'Модификатор ' + className + ' не поддерживается. Используйте опцию underline со значением ' + optionValue);
            }
         },

         getDOMContainer: function(element) {
            //TODO https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            if (element.get) {
               return element.get(0);
            }
            return element;
         }
      };

class Label extends Control<ILabelOptions> implements ICaption{
   protected _template: Function = LabelTemplate;
   protected _theme: string[] = ['Controls/input'];
   readonly '[Controls/_interface/ICaption]': true;

   private _warn(container: HTMLElement, className: string, )
         _afterMount: function() {
            var container = _private.getDOMContainer(this._container);

            /**
             * Способ смены внешнего вида контрола переведен с модификаторов на опцию.
             * Предупреждаем тех кто их использует, что им нужно поправить свой код.
             * Предупреждение будет удалено в 19.200 по задаче.
             * https://online.sbis.ru/opendoc.html?guid=7c63d5fe-db71-4a5c-91e9-3a422969c1c7
             */
            _private.warn(container, 'controls-Label_underline-hovered', 'hovered');
            _private.warn(container, 'controls-Label_underline_color-hovered', 'fixed');
         }
      };

      Label.getDefaultOptions = function() {
         return {
            underline: 'none'
         };
      };

      Label.getOptionTypes = function() {
         return {
            href: entity.descriptor(String),
            caption: entity.descriptor(String).required(),
            underline: entity.descriptor(String).oneOf([
               'none',
               'fixed',
               'hovered'
            ]),
            required: entity.descriptor(Boolean)
         };
      };


      export = Label;

