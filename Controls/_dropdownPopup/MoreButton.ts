import Control = require('Core/Control');
import template = require('wml!Controls/_dropdownPopup/MoreButton/MoreButton');
import collection = require('Types/collection');
import Merge = require('Core/core-merge');
import {factory} from 'Types/chain';

var MoreButton = Control.extend([], {
    _template: template,

    _openSelectorDialog: function() {

        // TODO: Selector/Controller сейчас не поддерживает работу с ключами: https://online.sbis.ru/opendoc.html?guid=936f6546-2e34-4753-85af-8e644c320c8b
        var selectedItems = [],
            self = this;
        factory(this._options.selectedKeys).each(function(key) {
            if (key !== undefined && key !== null) {
                selectedItems.push(self._options.items.getRecordById(key));
            }
        });

        var templateConfig = {
            selectedItems: new collection.List({ items: selectedItems })
        };
        Merge(templateConfig, this._options.selectorTemplate.templateOptions);
        this._children.selectorDialog.open({
            templateOptions: templateConfig,
            template: this._options.selectorTemplate.templateName,
            isCompoundTemplate: this._options.isCompoundTemplate,
            opener: this
        });
    },

    _selectorDialogResult: function(event, items) {
        var result = {
            action: 'selectorResult',
            event: event,
            data: items
        };
        this._notify('selectorResult', [result]);
    }
});

export = MoreButton;