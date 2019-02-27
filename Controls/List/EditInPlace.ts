import Control = require('Controls/_list/EditInPlace');

/**
             * This code exists because there's no way to declaratively change editing item, so the users are forced to write something like this:
             * editingItem.set('field', 'value').
             */
/**
 * @class Controls/List/EditInPlace
 * @extends Core/Control
 * @mixes Controls/interface/IEditableList
 * @author Зайцев А.С.
 * @private
 */
/** @lends Controls/List/EditInPlace.prototype */
/**
             * We should manually trigger update of the list, otherwise only inputs with validators are gonna get updated.
             */
/**
             * Validation doesn't reset if the value was changed without user input, so we have to reset it here.
             * Ideally, validation should take value through options and reset automagically.
             * TODO: https://online.sbis.ru/opendoc.html?guid=951f6762-8e37-4182-a7fc-3104a35ce27a
             */
/*
                 Если элемент выравнивается по правому краю, но при этом влезает весь текст, то нужно рассчитывать положение
                 курсора от правого края input'а, т.к. перед текстом может быть свободное место. Во всех остальных случаях
                 нужно рассчитывать от левого края, т.к. текст гарантированно прижат к нему.
                 */
export = Control;