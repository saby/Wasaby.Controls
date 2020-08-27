import {Control} from 'UI/Base';
import {Logger} from 'UI/Utils';
import {Model} from 'Types/entity';

import {Controller as MoverController, IControllerOptions, TMoveItems, MOVE_POSITION, MOVE_TYPE, TMoveItem} from 'Controls/mover';
import {DataSet} from "Types/source";
import {TKeySelection} from "../_interface/ISelectionType";

/**
 * Контрол для перемещения элементов списка в recordSet и dataSource.
 *
 * @remark
 * Контрол должен располагаться в одном контейнере {@link Controls/list:DataContainer} со списком.
 * В случае использования {@link Controls/operations:Controller} для корректной обработки событий необходимо помещать Controls/list:Mover внутри Controls/operations:Controller.
 *
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2FtreeGrid%2FMover%2FBase%2FIndex">демо-пример</a>
 * * <a href="/doc/platform/developmentapl/interface-development/controls/list-environment/actions/mover/">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_list.less">переменные тем оформления</a>
 *
 * @class Controls/_list/Mover
 * @extends Controls/_list/BaseAction
 * @mixes Controls/interface/IMovable
 * @mixes Controls/_interface/IHierarchy
 * @control
 * @public
 * @author Авраменко А.С.
 * @category List
 * @deprecated Используйте {@link Controls/mover:Controller}
 */

/*
 * Сontrol to move the list items in recordSet and dataSource.
 * Сontrol must be in one {@link Controls/list:DataContainer} with a list.
 * In case you are using {@link Controls/operations:Controller}
 * you should place Controls/list:Mover inside of Controls/operations:Controller.
 * <a href="/materials/Controls-demo/app/Controls-demo%2FOperationsPanel%2FDemo">Demo examples</a>.
 * @class Controls/_list/Mover
 * @extends Controls/_list/BaseAction
 * @mixes Controls/interface/IMovable
 * @mixes Controls/_interface/IHierarchy
 * @control
 * @public
 * @author Авраменко А.С.
 * @category List
 */

export default class Mover extends Control {
    protected _controller: MoverController;

    protected _beforeMount(options, context) {
        this._updateMoveController(options, context);
    }

    protected _beforeUpdate(options, context) {
        this._updateMoveController(options, context);
    }

    moveItemUp(item): Promise<DataSet|void> {
        return this._moveItemToSiblingPosition(item, MOVE_POSITION.before);
    }

    moveItemDown(item): Promise<DataSet|void> {
        return this._moveItemToSiblingPosition(item, MOVE_POSITION.after);
    }

    moveItems(items: TMoveItems, target: Model|TKeySelection, position: MOVE_POSITION): Promise<DataSet|void> {
        if (target === undefined) {
            return Promise.resolve();
        }
        return this._controller.getItems(items, target, position).then((selectedItems: TMoveItems) => {
            if (this._controller.getSelectedKeys(selectedItems).length) {
                const both = (result) => {
                    this._afterItemsMove(selectedItems, target, position, result);
                    return result;
                }
                return this._beforeItemsMove(selectedItems, target, position)
                    .then((moveType: MOVE_TYPE) => (
                        this._controller.moveItems(selectedItems, target, position, moveType).then((result) => both(result))
                    ));
            }
            return Promise.resolve();
        });
    }

    moveItemsWithDialog(items: TMoveItems): Promise<string> {
        return this._controller.moveItemsWithDialog(items);
    }

    /**
     * Обработчик перемещения при помощи диалога в HOC
     * @param items
     * @param target
     * @private
     */
    private _moveDialogOnResultHandler(items: TMoveItems, target: Model): void {
        this.moveItems(items, target, MOVE_POSITION.on);
    }

    private _beforeItemsMove(items, target, position): Promise<string> {
        const beforeItemsMoveResult = this._notify('beforeItemsMove', [items, target, position]);
        return beforeItemsMoveResult instanceof Promise ? beforeItemsMoveResult : Promise.resolve(beforeItemsMoveResult);
    }

    private _afterItemsMove(items, target, position, result): void {
        this._notify('afterItemsMove', [items, target, position, result]);

        //According to the standard, after moving the items, you need to unselect all in the table view.
        //The table view and Mover are in a common container (Control.Container.MultiSelector) and do not know about each other.
        //The only way to affect the selection in the table view is to send the selectedTypeChanged event.
        //You need a schema in which Mover will not work directly with the selection.
        //Will be fixed by: https://online.sbis.ru/opendoc.html?guid=dd5558b9-b72a-4726-be1e-823e943ca173
        this._notify('selectedTypeChanged', ['unselectAll'], {
            bubbling: true
        });
    }

    /**
     * Перемещает запись относительно ближайшего соседа
     * @param item
     * @param position
     * @private
     */
    private _moveItemToSiblingPosition(item: TMoveItem, position: MOVE_POSITION): Promise<DataSet|void> {
        const target = this._controller.getSiblingItem(item, position);
        return target ? this.moveItems([item], target, position) : Promise.resolve();
    }

    /**
     * @param options
     * @param context
     * @private
     */
    private _updateMoveController(options, context) {
        const _options: IControllerOptions = {
            items: context.dataOptions?.items,
            source: options.source || context.dataOptions?.source,
            keyProperty: options.keyProperty || context.dataOptions?.keyProperty,
            // for tree
            root: options.root,
            filter: context.dataOptions?.filter,
            searchParam: options.searchParam,
            sortingOrder: options.sortingOrder,
            nodeProperty: options.nodeProperty,
            parentProperty: options.parentProperty
        }
        if (options.moveDialogTemplate) {
            _options.dialog = {
                opener: this,
                onResultHandler: this._moveDialogOnResultHandler.bind(this)
            };
            if (options.moveDialogTemplate.templateName) {
                _options.dialog.template = options.moveDialogTemplate.templateName;
                _options.dialog.templateOptions = options.moveDialogTemplate.templateOptions;
            } else {
                _options.dialog.template = options.moveDialogTemplate;
                Logger.warn('Mover: Wrong type of moveDialogTemplate option, use object notation instead of template function', this);
            }
        }
        if (!this._controller) {
            this._controller = new MoverController(_options);
        } else {
            this._controller.update(_options);
        }
    }
}
