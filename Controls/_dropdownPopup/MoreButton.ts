import Control = require('Core/Control');
import template = require('wml!Controls/_dropdownPopup/MoreButton/MoreButton');
import collection = require('Types/collection');
import Merge = require('Core/core-merge');
import {factory} from 'Types/chain';

var MoreButton = Control.extend([], {
    _template: template,

    _openSelectorDialog: function() {
        const self = this;
        const selectorOpener = this._options.selectorOpener;
        const selectorTemplate = this._options.selectorTemplate;
        let selectedItems = [];

        // TODO: Selector/Controller сейчас не поддерживает работу с ключами: https://online.sbis.ru/opendoc.html?guid=936f6546-2e34-4753-85af-8e644c320c8b
        factory(this._options.selectedKeys).each(function(key) {
            if (key !== undefined && key !== null) {
                selectedItems.push(self._options.items.getRecordById(key));
            }
        });

        var templateConfig = {
            selectedItems: new collection.List({ items: selectedItems }),
            handlers: {
                onSelectComplete: function(event, result) {
                    self._selectorDialogResult(event, result);
                    selectorOpener.close();
                }
            }
        };
        Merge(templateConfig, selectorTemplate.templateOptions);
        selectorOpener.open(Merge({
            templateOptions: templateConfig,
            template: selectorTemplate.templateName,
            isCompoundTemplate: this._options.isCompoundTemplate,
            handlers: {
                // Для совместимости.
                // Старая система фокусов не знает про существование VDOM окна и не может восстановить на нем фокус после закрытия старой панели.
                onAfterClose: function () {
                    self.activate();
                }
            },
            opener: this
        }, selectorTemplate.popupOptions || {}));
        this._notify('close', [], {bubbling: true});
    }
});

export = MoreButton;