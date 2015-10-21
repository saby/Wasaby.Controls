/**
 * Created by iv.cheremushkin on 21.04.2015.
 */
define('js!SBIS3.CONTROLS.DropdownListMixin', [],
    function () {
        /**
         * @mixin SBIS3.CONTROLS.DropdownListMixin
         * @public
         * @author Крайнов Дмитрий Олегович
         */
        'use strict';

        var DropdownListMixin = /**@lends SBIS3.CONTROLS.DropdownListMixin.prototype  */{
            $protected: {
                _options: {
                   /**
                    * @cfg {} Шаблон отображения каждого элемента коллекции
                    */
                    itemTemplate: ''
                }
            },

            $constructor: function () {
                if (!this._options.displayField) {
                     //По умолчанию отображаемое поле - 'title'
                    this._options.displayField = 'title';
                }
            },

            _getItemTemplate: function (item) {
                var title = item.get(this._options.displayField);
                if (this._options.itemTemplate) {
                    return this._options.itemTemplate.call(this, {item: item, title: title})
                }
                else {
                    return '<div>' + title + '</div>';
                }
            },

            _bindItemSelect: function () {
                var self = this;
                //TODO придумать что то нормальное и выпилить
                this._picker.getContainer().mousedown(function (e) {
                    e.stopPropagation();
                });
                this._picker.getContainer().bind('mouseup', function (e) {
                    var row = $(e.target).closest('.' + self._getItemClass());
                    if (row.length) {
                        self.setSelectedKeys([row.data('id')]);
                        self.hidePicker();
                    }
                });
            },

            _getItemClass: function() {
                /*Method must be implemented*/
            }
        };

        return DropdownListMixin;
    });

