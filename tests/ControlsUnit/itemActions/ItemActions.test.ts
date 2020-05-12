import { assert } from 'chai';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Collection, CollectionItem } from 'Controls/display';
import { IOptions as ICollectionOptions } from 'Controls/_display/Collection';

import { Controller as ItemActionsController, IItemActionsControllerOptions } from 'Controls/_itemActions/Controller';
import {
    IItemActionsCollection,
    IItemAction,
    IItemActionsItem,
    TItemActionShowType
} from 'Controls/_itemActions/interface/IItemActions';

const itemActions = [
    {
        id: 1,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.MENU
    },
    {
        id: 2,
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU_TOOLBAR
    },
    {
        id: 3,
        icon: 'icon-Profile',
        title: 'Profile',
        showType: TItemActionShowType.TOOLBAR
    }
];

const flatItemActions = [
    {
        id: 1,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.TOOLBAR
    }
];

describe('Controls/_itemActions/Controller', () => {
    let itemActionsController: ItemActionsController;
    let collection: Collection<Record>; // IItemActionsCollection;

    function makeCollection(): Collection<Record> {
        const list = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {id: 1, name: 'Philip J. Fry', gender: 'M', itemActions: []},
                {
                    id: 2,
                    name: 'Turanga Leela',
                    gender: 'F',
                    itemActions: [
                        {
                            id: 1,
                            icon: 'icon-Link',
                            title: 'valar morghulis',
                            showType: TItemActionShowType.TOOLBAR
                        },
                        {
                            id: 2,
                            icon: 'icon-Print',
                            title: 'print',
                            showType: TItemActionShowType.MENU
                        }
                    ]
                },
                {id: 3, name: 'Professor Farnsworth', gender: 'M', itemActions: []},
                {id: 4, name: 'Amy Wong', gender: 'F', itemActions: []},
                {id: 5, name: 'Bender Bending Rodriguez', gender: 'R', itemActions: []}
            ]
        });
        const collectionConfig: ICollectionOptions<Record, IItemActionsItem> = {
            collection: list,
            keyProperty: 'id',
            leftSpacing: null,
            rightSpacing: null,
            rowSpacing: null,
            searchValue: null,
            editingConfig: null
        };
        return new Collection<Record>(collectionConfig);
    }

    function initializeControllerOptions(options?: IItemActionsControllerOptions): IItemActionsControllerOptions {
        const result = {
            collection,
            itemActions: options ? options.itemActions : null,
            itemActionsProperty: options ? options.itemActionsProperty : null,
            visibilityCallback: options ? options.visibilityCallback : null,
            itemActionsPosition: options ? options.itemActionsPosition : null,
            style: options ? options.style : null,
            theme: options ? options.theme : 'default',
            actionAlignment: options ? options.actionAlignment : null,
            actionCaptionPosition: options ? options.actionCaptionPosition : null,
            editingToolbarVisible: options ? options.editingToolbarVisible : false
        };
        return result;
    }

    beforeEach(() => {
        collection = makeCollection();
        itemActionsController = new ItemActionsController();
        itemActionsController.update(initializeControllerOptions({
            collection,
            itemActions,
            theme: 'default'
        }));
    });

    describe('Controller initialization is correct', () => {
        // T1.1.  Для каждого элемента коллекции задаётся набор операций.
        it('should assign item actions for every item', () => {
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            const actionsOf5 = collection.getItemBySourceKey(5).getActions();
            assert.isNotNull(actionsOf1, 'actions were not set to item 1');
            assert.isNotNull(actionsOf5, 'actions were not set to item 5');
            assert.equal(actionsOf1.showed[0].title, 'message');
            assert.equal(actionsOf5.showed[0].title, 'message');
        });

        // T1.2.  В коллекции происходит набор конфигурации для шаблона ItemActions.
        it('should build a config for item action template', () => {
            const config = collection.getActionsTemplateConfig();
            assert.isNotNull(config, 'getActionsTemplateConfig was not set to collection');
        });

        // T1.3. При установке набора операций вызывается VisibilityCallback.
        it('should call visibilityCallback for every item action', () => {
            itemActionsController.update(initializeControllerOptions({
                collection,
                itemActions,
                theme: 'default',
                visibilityCallback: (action: IItemAction, item: Record) => {
                    if (item.getKey() === 4 && action.id === 2) {
                        return false;
                    }
                    return true;
                }
            }));
            const actionsOf4 = collection.getItemBySourceKey(4).getActions();
            const actionsOf5 = collection.getItemBySourceKey(5).getActions();
            assert.isNotNull(actionsOf4, 'actions were not set to item 4');
            assert.isNotNull(actionsOf5, 'actions were not set to item 5');
            assert.notExists(actionsOf4.showed.find((action) => action.title === 'message'));
            assert.exists(actionsOf5.showed.find((action) => action.title === 'message'));
        });

        // T1.4. При установке набора операций учитывается itemActionsProperty
        it('should consider itemActionsProperty', () => {
            itemActionsController.update(initializeControllerOptions({
                collection,
                itemActions,
                theme: 'default',
                itemActionsProperty: 'itemActions'
            }));
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            const actionsOf2 = collection.getItemBySourceKey(2).getActions();
            assert.isNotNull(actionsOf1, 'actions were not set to item 1');
            assert.isNotNull(actionsOf2, 'actions were not set to item 2');
            assert.isEmpty(actionsOf1.showed);
            assert.equal(actionsOf2.showed[0].title, 'valar morghulis');
        });

        // T1.6. После установки набора операций у коллекции устанавливается параметр actionsAssigned
        it('should set actionsAssigned value as true', () => {
            assert.isTrue(collection.isActionsAssigned());
        });

        // T1.7. Если требуется добавить кнопку меню, то она добавляется в список showed операций, иначе не добавляется
        it('should append menu button to item actions when it necessary', () => {
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            assert.isNotNull(actionsOf1, 'actions were not set to item 1');
            assert.isTrue(actionsOf1.showed[actionsOf1.showed.length - 1]._isMenu);
        });

        it('should not append menu button to item actions when it not necessary', () => {
            itemActionsController.update(initializeControllerOptions({
                collection,
                itemActions: flatItemActions,
                theme: 'default'
            }));
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            assert.isNotNull(actionsOf1, 'actions were not set to item 1');
            assert.isNotTrue(actionsOf1.showed[actionsOf1.showed.length - 1]._isMenu);
        });

        // T1.8. В список showed операций изначально попадают операции с showType TOOLBAR или MENU_TOOLBAR, и у которых нет родителя
        it('should add to "showed" item actions only actions with showType TOOLBAR or MENU_TOOLBAR, w/o parent', () => {

        });

        // T1.9. После установки набора операций, операции с иконками содержат в поле icon CSS класс “controls-itemActionsV__action_icon icon-size” (оч сомнительный тест)
        // TODO Возможно, установка этого класса переедет в шаблон
        it('should set to all item actions icons "controls-itemActionsV__action_icon icon-size" CSS class', () => {

        });

        // T1.10. При реальной смене у операций элементов настроек all/showed должна изменяться версия модели (если это возможно проверить)
        // TODO Возможно, это не корректный тест, т.к. по обсуждению от 08.05 была идея убрать смену версии модели из контроллера.
        it('should call collection version update after changing assigned actions', () => {

        });

        // T1.11. Если в ItemActions всё пусто, не должно происходить инициализации
        it('should not initialize item actions when itemActions and itemActionsProperty are not set ', () => {

        });

        // T1.14. Должны адекватно набираться ItemActions для breadcrumbs (когда getContents() возвращает массив записей)
        // TODO возможно, это уйдёт из контроллера, т.к. по идее уровень абстракции в контроллере ниже и он не должен знать о breadcrumbs
        it('should set item actions when some items are breadcrumbs', () => {

        });

        // T1.15. Должны адекватно набираться ItemActions если в списке элементов коллекции присутствуют группы
        // TODO возможно, это уйдёт из контроллера, т.к. по идее уровень абстракции в контроллере ниже и он не должен знать о группах
        it('should set item actions when some items are groups', () => {

        });
    });

    // T2. Активация и деактивация Swipe происходит корректно
    describe('activateSwipe(), deactivateSwipe() and getSwipeItem() ', () => {
        // T2.1. В коллекции происходит набор конфигурации для Swipe, если позиция itemActions не outside
        it('should collect correct item actions when position !== "outside"', () => {

        });

        // T2.2. В коллекции не происходит набор конфигурации для Swipe, если позиция itemActions outside
        it('should collect correct item actions when position === "outside"', () => {

        });

        // T2.3. В зависимости от actionAlignment, для получения конфигурации используется правильный measurer
        it('should use correct measurer depending on actionAlignment property', () => {

        });

        // T2.4. Конфигурация для Swipe происходит с actionAlignment=’horizontal’, если требуется horizontalMeasurement
        it('should collect swipe configuration with actionAlignment="horizontal" when horizontalMeasurement is forced to be used', () => {

        });

        // T2.5. Конфигурация для Swipe происходит с установкой twoColumnsActions, если measurer вернул в конфиг twoColumns
        it('should collect swipe configuration with setting of twoColumnsActions property, when measurer has set twoColumns to the config', () => {

        });

        // T2.6. Устанавливается swiped элемент коллекции
        // T2.7. Устанавливается активный элемент коллекции
        it('should set swiped and active collection item', () => {
//         const item = makeActionsItem();
            //
            //         const collection = makeCollection();
            //         collection.getItemBySourceKey = () => item;
            //
            //         itemActionsController.activateSwipe(collection, 'test', 0);
            //
            //         assert.isTrue(item.isSwiped());
            //         assert.isTrue(item.isActive());
            //         assert.isAbove(collection.getVersion(), 0);
        });

        // T2.8. Метод getSwipedItem возвращает корректный swiped элемент
        // @TODO Возможно, этот метод можно будет сделать приватным после отказа т старой модели
        it('should return swiped item from collection when calling getSwipedItem()', () => {
//         const item = makeActionsItem();
            //         item.setSwiped(true);
            //
            //         const collection = makeCollection();
            //         collection.find = () => item;
            //
            //         itemActionsController._setSwipeItem(collection, null);
            //
            //         assert.isFalse(item.isSwiped());
            //         assert.isAbove(collection.getVersion(), 0);

            //     it('returns current swipe item', () => {
            //         const item = makeActionsItem();
            //
            //         const collection = makeCollection();
            //
            //         assert.isNull(itemActionsController._getSwipeItem(collection));
            //
            //         collection.find = () => item;
            //         assert.strictEqual(
            //             itemActionsController._getSwipeItem(collection),
            //             item
            //         );
            //     });
        });

        // T2.9. Происходит сброс swiped элемента, активного элемента, конфигурации для Swipe при деактивации свайпа
        it('should reset swiped item, active item and swipe configuration when deactivating swipe', () => {
//         const item = makeActionsItem();
            //         item.setSwiped(true);
            //         item.setActive(true);
            //
            //         const collection = makeCollection();
            //         collection.find = () => item;
            //
            //         itemActionsController.deactivateSwipe(collection);
            //
            //         assert.isFalse(item.isSwiped());
            //         assert.isFalse(item.isActive());
            //         assert.isAbove(collection.getVersion(), 0);
        });
    });

    describe('prepareActionsMenuConfig()', () => {
        // T3.1. Если в метод передан parentAction и это не кнопка открытия меню, то result.templateOptions.showHeader будет true
        it('should set result.templateOptions.showHeader as true when parentAction is set and item isn\'t _isMenu', () => {

        });

        // T3.2. Если в метод не передан parentAction или это кнопка открытия меню, то result.templateOptions.showHeader будет false
        it('should set result.templateOptions.showHeader as false when parentAction isn\'t set or item is _isMenu', () => {

        });

        // T3.3. Если в метод передан contextMenu=true, то в result.direction.horizontal будет right, иначе left
        it('should set result.direction.horizontal as \'right\' when contextMenu=true and \'left\' when contextMenu=false', () => {

        });

        // T3.4. Если в метод передан contextMenu=false, то в result.target будет объект с копией clickEvent.target.getBoundingClientRect()
        it('should set result.target as copy of clickEvent.target.getBoundingClientRect()', () => {

        });

        // T3.5. Расчёт статичных параметров контекстного меню соответствует ожиданиям
        it('should set hard-coded parameters as expected', () => {

        });

        // T3.6. Result.templateOptions.source содержит меню из ItemActions, соответствующих текущему parentAction
        // it('returns an empty array if actions are not set');
        // it('returns actions with showType of MENU and MENU_TOOLBAR');
        // it('returns child actions');
        it('should set result.templateOptions.source responsible to current parentActions', () => {

        });

        // T3.7. Result.templateOptions.source содержит меню из всех ItemActions не-первого уровня, если в качестве parentAction была указана кнопка “Показать меню”
        it('should set result.templateOptions.source as set of all non-first-level ItemActions when parentAction is _isMenu', () => {

        });
    });

    // todo incorrect
    // describe('prepareActionsMenuConfig()', () => {
    //     it('prepares actions menu config', () => {
    //         const actionsItem = makeActionsItem();
    //         actionsItem.setActions({
    //             all: [
    //                 { id: 1, showType: showType.MENU },
    //                 { id: 1, showType: showType.MENU_TOOLBAR }
    //             ]
    //         });
    //
    //         const collection = makeCollection();
    //         collection.getItemBySourceKey = () => actionsItem;
    //
    //         let actionsMenuConfig = null;
    //         collection.setActionsMenuConfig = (config) => actionsMenuConfig = config;
    //
    //         // Mock Sticky.opener
    //         // itemActionsController.prepareActionsMenuConfig(
    //         //     'test',
    //         //     {
    //         //         preventDefault: () => null,
    //         //         target: {
    //         //             getBoundingClientRect: () => {
    //         //                 return {};
    //         //             }
    //         //         }
    //         //     },
    //         //     null,
    //         //     '' // Mock HTML El or Control
    //         // );
    //
    //         assert.isTrue(actionsItem.isActive());
    //         assert.isOk(actionsMenuConfig);
    //         assert.isAbove(collection.getVersion(), 0);
    //     });
    // });
});

