import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_propertyGrid/PropertyGrid';
import {default as renderTemplate} from 'Controls/_propertyGrid/Render';
import {IPropertyGridOptions} from 'Controls/_propertyGrid/IPropertyGrid';

/**
 * Контрол, который позволяет пользователям просматривать и редактировать свойства объекта.
 * Вы можете использовать стандартные редакторы PropertyGrid или специальные редакторы.
 * По умолчанию propertyGrid будет автоматически генерировать все свойства для данного объекта.
 * @class Controls/_propertyGrid/PropertyGrid
 * @extends Core/Control
 * @mixes Controls/_propertyGrid/IPropertyGrid
 * @demo Controls-demo/PropertyGridNew/Group/Expander/Index
 * @control
 * @public
 * @author Герасимов А.М.
 */

/*
 * Represents a control that allows users to inspect and edit the properties of an object.
 * You can use the standard editors that are provided with the PropertyGrid or you can use custom editors.
 * By default the propertyGrid will autogenerate all the properties for a given object
 * @class Controls/_propertyGrid/PropertyGrid
 * @extends Core/Control
 * @mixes Controls/_propertyGrid/IPropertyGrid
 * @control
 * @public
 * @author Герасимов А.М.
 */

class PropertyGrid extends Control<IPropertyGridOptions>  {
    protected _template: TemplateFunction = template;
    protected _render: TemplateFunction = renderTemplate;
}

PropertyGrid._theme = ['Controls/propertyGrid'];

export default PropertyGrid;
