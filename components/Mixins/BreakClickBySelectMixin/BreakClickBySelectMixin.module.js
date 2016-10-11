define('js!SBIS3.CONTROLS.BreakClickBySelectMixin', [], function() {
    /**
     * Миксин, предотвращающий вызов обработчика клика, при выделении текста внутри контрола.
     * @mixin SBIS3.CONTROLS.BreakClickBySelect
     * @public
     * @author Крайнов Дмитрий Олегович
     */

    var BreakClickBySelectMixin = /**@lends SBIS3.CONTROLS.BreakClickBySelect.prototype  */{
        $constructor: function () {
            var self = this;
            this._container.bind('mousedown', function () {
                if (self._hasSelectionInContainer()) {
                    self._getSelection().removeAllRanges();
                }
            });
        },
        _hasSelectionInContainer: function() {
            var selection = this._getSelection();
            return !selection.isCollapsed && !!this._container.find(selection.focusNode).length;
        },
        _getSelection: function() {
            return $ws._const.browser.isIE8 ? window.getSelectionForIE() : window.getSelection();
        },
        around: {
            _onClickHandler: function(parentFunc, event) {
                //Вызываем обработчик клика, только если нет выделения в контейнере контрола
                if (!this._hasSelectionInContainer()) {
                    parentFunc.call(this, event);
                }
            }
        }
    };

    return BreakClickBySelectMixin;
});