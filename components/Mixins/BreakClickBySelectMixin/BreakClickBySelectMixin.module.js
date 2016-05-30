define('js!SBIS3.CONTROLS.BreakClickBySelectMixin', [], function() {
    /**
     * Миксин, предотвращающий вызов обработчика клика, при выделении текста внутри контрола.
     * @mixin SBIS3.CONTROLS.BreakClickBySelect
     * @public
     * @author Крайнов Дмитрий Олегович
     */

    var BreakClickBySelectMixin = /**@lends SBIS3.CONTROLS.BreakClickBySelect.prototype  */{
        around: {
            _onClickHandler: function(parentFunc, event) {
                var selection = $ws._const.browser.isIE8 ? window.getSelectionForIE() : window.getSelection();
                if (selection.type !== "Range") {
                    parentFunc.call(this, event);
                }
            }
        }
    };

    return BreakClickBySelectMixin;
});