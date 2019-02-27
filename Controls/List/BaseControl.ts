import Control = require('Controls/_list/BaseControl');

/* Перезагрузка полностью обновляет данные в рекордсете, а значит индексы, высоты элементов и распорок
                 потеряли актуальность, сбрасываем их. */
/**/
/* После догрузки данных потенциально изменяется (увеличивается) количество записей,
                 нужно пересчитать Virtual Scroll*/
/**
     * Обработать прокрутку списка виртуальным скроллом
     */
/**
 * Компонент плоского списка, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
 * @class Controls/List/BaseControl
 * @extends Core/Control
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IPromisedSelectable
 * @mixes Controls/interface/IGrouped
 * @mixes Controls/interface/INavigation
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/IHighlighter
 * @mixes Controls/List/interface/IBaseControl
 * @mixes Controls/interface/IEditableList
 * @mixes Controls/List/BaseControl/Styles
 * @control
 * @public
 * @author Авраменко А.С.
 * @category List
 */
/** @lends Controls/List/BaseControl.prototype */
/*Оставляю старое поведение без опции для скролла вверх. Спилить по задаче https://online.sbis.ru/opendoc.html?guid=ef8e4d25-1137-4c94-affd-759e20dd0d63*/
/**
         * TODO: Сейчас нет возможности понять предусмотрено выделение в списке или нет.
         * Опция multiSelectVisibility не подходит, т.к. даже если она hidden, то это не значит, что выделение отключено.
         * Пока единственный надёжный способ различить списки с выделением и без него - смотреть на то, приходит ли опция selectedKeysCount.
         * Если она пришла, то значит выше есть Controls/Container/MultiSelector и в списке точно предусмотрено выделение.
         *
         * По этой задаче нужно придумать нормальный способ различать списки с выделением и без:
         * https://online.sbis.ru/opendoc.html?guid=ae7124dc-50c9-4f3e-a38b-732028838290
         */
/**
             * After the right swipe the item should get selected.
             * But, because selectionController is a component, we can't create it and call it's method in the same event handler.
             */
/*
             When user clicks on checkbox we shouldn't fire itemClick event because no one actually expects or wants that.
             We can't stop click on checkbox from propagating because we can only subscribe to valueChanged event and then
             we'd be stopping the propagation of valueChanged event, not click event.
             And even if we could stop propagation of the click event, we shouldn't do that because other components
             can use it for their own reasons (e.g. something like TouchDetector can use it).
             */
/*TODO переношу сюда костыль сделанный по https://online.sbis.ru/opendoc.html?guid=ce307671-679e-4373-bc0e-c11149621c2a*/
/*только под опцией для скролла вверх. Спилить по задаче https://online.sbis.ru/opendoc.html?guid=ef8e4d25-1137-4c94-affd-759e20dd0d63*/
/* ListView.getOptionTypes = function getOptionTypes(){
 return {
 dataSource: Types(ISource)
 }
 }; */
export = Control;