import { assert } from 'chai';

import {Controller as ItemActionsController} from 'Controls/_itemActions/Controller';

describe('Controls/_itemActions/Controller', () => {
    let itemActionsController: ItemActionsController;

    function makeActionsItem() {
        const item = {
            _$swiped: false,
            isSwiped: () => item._$swiped,
            setSwiped: (swiped) => item._$swiped = swiped,

            _$active: false,
            isActive: () => item._$active,
            setActive: (active) => item._$active = active,

            _$actions: null,
            getActions: () => item._$actions,
            setActions: (actions) => item._$actions = actions
        };
        return item;
    }

    function makeCollection() {
        const collection = {
            _version: 0,
            getVersion: () => collection._version,
            nextVersion: () => collection._version++,

            find: () => null,
            getItemBySourceKey: () => null,

            getSwipeConfig: () => ({}),
            setSwipeConfig: () => null,
            getActionsTemplateConfig: () => ({}),
            setActionsTemplateConfig: () => null,
            setActionsMenuConfig: (config) => ({});
        };
        return collection;
    }

    beforeEach(() => {
        itemActionsController = new ItemActionsController();
    });

    describe('Controller initialization is correct', () => {
        // T1.1.  Для каждого элемента коллекции задаётся набор операций.
        it('should assign item actions for every item', () => {

        });

        // T1.2.  В коллекции происходит набор конфигурации для шаблона ItemActions.
        it('should build a config for item action template', () => {

        });

        // T1.3. При установке набора операций вызывается VisibilityCallback.
        it('should call visibilityCallback for every item action', () => {

        });

        // T1.4. При установке набора операций учитывается itemActionsProperty
        it('should consider itemActionsProperty', () => {

        });

        // T1.5. После установки набора операций у коллекции устанавливается параметр eventRaising
        it('should set event raising for collection', () => {

        });

        // T1.6. После установки набора операций у коллекции устанавливается параметр actionsAssigned
        it('should set actionsAssigned value as true', () => {

        });

        // T1.7. Если требуется добавить кнопку меню, то она добавляется в список showed операций
        it('should append menu button to item actions when it necessary', () => {

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
        it('should call version update after changing assigned actions', () => {

        });

        // T1.11. Если в ItemActions всё пусто, не должно происходить инициализации
        it('', () => {

        });

        // T1.12. Если изменился visibilityCallback, то должна происходить переинициализация
        it('', () => {

        });

        // T1.13. Если открылась ветка дерева, то должна происходить переинициализация
        it('', () => {

        });

        // T1.14. Должны адекватно набираться ItemActions для breadcrumbs (когда getContents() возвращает массив записей)
        it('', () => {

        });

        // T1.15. Должны адекватно набираться ItemActions если в списке элементов коллекции присутствуют группы
        it('', () => {

        });
    });

    // T2. Активация и деактивация Swipe происходит корректно
    describe('T2. Активация и деактивация Swipe происходит корректно', () => {
        // T2.1. В коллекции происходит набор конфигурации для Swipe, если позиция itemActions не outside
        it('', () => {

        });

        // T2.2. В коллекции не происходит набор конфигурации для Swipe, если позиция itemActions outside
        it('', () => {

        });

        // T2.3. В зависимости от actionAlignment, для получения конфигурации используется правильный measurer
        it('', () => {

        });

        // T2.4. Конфигурация для Swipe происходит с actionAlignment=’horizontal’, если требуется horizontalMeasurement
        it('', () => {

        });

        // T2.5. Конфигурация для Swipe происходит с установкой twoColumnsActions, если measurer вернул в конфиг twoColumns
        it('', () => {

        });

        // T2.6. Устанавливается swiped элемент коллекции
        it('', () => {

        });

        // T2.7. Устанавливается активный элемент коллекции
        it('', () => {

        });

        // T2.8. Метод getSwipedItem возвращает корректный swiped элемент
        it('', () => {

        });

        // T2.9. Происходит сброс swiped элемента, активного элемента, конфигурации для Swipe при деактивации свайпа
        it('', () => {

        });
    });

    describe('T3. Набор конфигурации для выпадающего/контекстного меню происходит корректно', () => {
        // T3.1. Если в метод передан parentAction и это не кнопка открытия меню, то result.templateOptions.showHeader будет true
        it('', () => {

        });

        // T3.2. Если в метод не передан parentAction или это кнопка открытия меню, то result.templateOptions.showHeader будет false
        it('', () => {

        });

        // T3.3. Если в метод передан contextMenu=true, то в result.direction.horizontal будет right, иначе left
        it('', () => {

        });

        // T3.4. Если в метод передан contextMenu=false, то в result.target будет объект с копией clickEvent.target.getBoundingClientRect()
        it('', () => {

        });

        // T3.5. Расчёт статичных параметров контекстного меню соответствует ожиданиям
        it('', () => {

        });

        // T3.6. Result.templateOptions.source содержит меню из ItemActions, соответствующих текущему parentAction
        it('', () => {

        });

        // T3.7. Result.templateOptions.source содержит меню из всех ItemActions не-первого уровня, если в качестве parentAction была указана кнопка “Показать меню”
        it('', () => {

        });
    });

    // describe('assignActions()', () => {
    //     it('uses visibility callback');
    //     it('fixes actions icon');
    //     it('adds menu button when needed');
    //     it('does not add menu button when not needed');
    // });
    //
    // describe('resetActionsAssignment()', () => {
    //     it('resets actions assignment flag');
    // });
    //
    // // TODO INEXISTS
    // describe('setActionsToItem()', () => {
    //     it('sets actions');
    //     describe('checks difference between old and new actions', () => {
    //         it('detects no difference');
    //         it('detects count increase');
    //         it('detects count decrease');
    //         it('detects id difference');
    //         it('detects icon difference');
    //         it('detects showed difference');
    //     });
    // });
    //
    // describe('calculateActionsTemplateConfig()', () => {
    //     it('sets item actions size depending on edit in place');
    // });
    //
    // describe('setActiveItem()', () => {
    //     it('deactivates old active item');
    //     it('activates new active item');
    // });
    //
    // describe('getActiveItem()', () => {
    //     it('returns currently active item');
    // });
    //
    // describe('getMenuActions()', () => {
    //     it('returns actions with showType of MENU and MENU_TOOLBAR');
    // });
    //
    // describe('getChildActions()', () => {
    //     it('returns an empty array if actions are not set');
    //     it('returns an empty array if there are no child actions');
    //     it('returns child actions');
    // });
    //
    // describe('processActionClick()', () => {
    //     it('opens submenu if action has subactions');
    //     it('executes handler');
    // });

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

    // TODO TypeError: Cannot read property 'find' of undefined
    //     at ItemActionsController._getSwipeItem (Controls/_itemActions/ItemActionsController.js:257:37)
    // describe('activateSwipe()', () => {
    //     it('sets swipe and activity on the swiped item', () => {
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
    //     });
    // });
    //
    // describe('deactivateSwipe()', () => {
    //     it('unsets swipe and activity on swipe item', () => {
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
    //     });
    // });

    // todo setSwipeItem is private now
    // describe('setSwipeItem()', () => {
    //     it('unsets swipe from old swipe item', () => {
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
    //     });
    //     it('sets swipe to new swipe item', () => {
    //         const item = makeActionsItem();
    //
    //         const collection = makeCollection();
    //         collection.getItemBySourceKey = () => item;
    //
    //         itemActionsController._setSwipeItem(collection, 'test');
    //
    //         assert.isTrue(item.isSwiped());
    //         assert.isAbove(collection.getVersion(), 0);
    //     });
    // });

    // todo getSwipeItem is private now
    // describe('getSwipeItem()', () => {
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
    // });
});

