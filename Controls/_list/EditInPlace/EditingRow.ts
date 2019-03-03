import Control = require('Core/Control');
import scrollToElement = require('Controls/Utils/scrollToElement');
import template = require('wml!Controls/_list/EditInPlace/EditingRow');

var EditingRow = Control.extend({
    _template: template,

    _afterMount: function () {
        this.activate();

        // TODO: this._container может быть не HTMLElement, а jQuery-элементом, убрать после https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
        var container = this._container.get ? this._container.get(0) : this._container;

        setTimeout(function () {
            scrollToElement(container);
        }, 0);
    },

    _onKeyDown: function (event) {
        this._notify('editingRowKeyDown', [event.nativeEvent], {bubbling: true});
        event.stopPropagation();
    },

    _onClickHandler: function (e) {
        /*
         Останавливаем всплытие любых кликов, если строка редактируется. Если клики будут всплывать, то их будет ловить список
         и генерировать событие itemClick, которое не должно стрелять на редактируемой строке.
         Был ещё другой вариант: останавливать клик на поле ввода. Тогда возникают несколько проблем:
         - На каждом компоненте, который будет лежать внутри редактируемой строки, придется останавливать всплытие.
         - Другие компоненты (например, TouchDetector) могут следить за кликами на поле ввода, т.е. безусловный stopPropagation сломал бы ту логику.
         */
        e.stopPropagation();
    }
});

export = EditingRow;
