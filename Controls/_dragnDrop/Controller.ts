import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_dragnDrop/Controller/Controller');
import 'Controls/_dragnDrop/DraggingTemplate';
import {DialogOpener} from 'Controls/popup';
import {IDragObject} from './Container';
/**
 * Контроллер обеспечивает взаимосвязь между контейнерами перемещения Controls/dragnDrop:Container.
 * Он отслеживает события контейнеров и оповещает о них другие контейнеры.
 * Контроллер отвечает за отображение и позиционирование шаблона, указанного в опции draggingTemplate в контейнерах.
 * Перетаскивание элементов работает только внутри Controls/dragnDrop:Container.
 *
 * @remark
 * @remark
 * Полезные ссылки:
 * * <a href="/doc/platform/developmentapl/interface-development/controls/tools/drag-n-drop/">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_dragnDrop.less">переменные тем оформления</a>
 *
 * @class Controls/_dragnDrop/Controller
 * @extends Core/Control
 * @control
 * @public
 * @author Авраменко А.С.
 * @category DragNDrop
 */

/*
 * The drag'n'drop Controller provides a relationship between different Controls/dragnDrop:Container.
 * It tracks Container events and notifies other Containers about them.
 * The Controller is responsible for displaying and positioning the template specified in the draggingTemplate option at the Containers.
 * Drag and drop the entity only works inside Controls/dragnDrop:Container.
 * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
 * @class Controls/_dragnDrop/Controller
 * @extends Core/Control
 * @control
 * @public
 * @author Авраменко А.С.
 * @category DragNDrop
 */

class Controller extends Control<IControlOptions> {
    _template: TemplateFunction = template;
    _dialogOpener: DialogOpener = new DialogOpener();

    _documentDragStart(event: Event, dragObject: IDragObject): void {
        this._children.dragStartDetect.start(dragObject);
        this._notify('dragStart');
    }

    _documentDragEnd(event: Event, dragObject: IDragObject): void {
        this._children.dragEndDetect.start(dragObject);
        this._dialogOpener.close();
        this._notify('dragEnd');
    }

    _updateDraggingTemplate(event: Event, draggingTemplateOptions: IDragObject, draggingTpl: TemplateFunction): void {
        this._dialogOpener.open({
            topPopup: true,
            opener: null,
            template: draggingTpl,
            templateOptions: draggingTemplateOptions,
            top: draggingTemplateOptions.position.y,
            left: draggingTemplateOptions.position.x
        });
    }

    _beforeUnmount(): void {
        this._dialogOpener.destroy();
        this._dialogOpener = null;
    }
}

Controller._styles = ['Controls/dragnDrop'];
export = Controller;
