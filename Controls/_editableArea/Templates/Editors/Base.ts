import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_editableArea/Templates/Editors/Base/Base');
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Базовый шаблон редактирования полей ввода. Имитирует стили {@link Controls/input:Text Text}.
 * <a href="/materials/Controls-demo/app/Controls-demo%2FEditableArea%2FEditableArea">Демо-пример</a>.
 *
 * @class Controls/_editableArea/Templates/Editors/Base
 * @extends Core/Control
 * @author Авраменко А.С.
 * @public
 * @see Controls/_editableArea/Templates/Editors/DateTime
 *
 * @demo Controls-demo/EditableArea/EditableArea
 */

class Base extends Control<IControlOptions> {
   protected _template: TemplateFunction = template;

   _prepareValueForEditor(value: string | TemplateFunction): string | TemplateFunction {
      return value;
   }

   _editorValueChangeHandler(event: SyntheticEvent, value: string | TemplateFunction): void {
      this._notify('valueChanged', [value]);
   }

   static _theme: string[] = ['Controls/editableArea'];
}

export default Base;
