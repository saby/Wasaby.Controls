define('js!SBIS3.CONTROLS.Demo.MyOperationsPanel', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyOperationsPanel', 'js!SBIS3.CONTROLS.ComponentBinder', 'css!SBIS3.CONTROLS.Demo.MyOperationsPanel', 'js!SBIS3.CONTROLS.OperationsPanelButton', 'js!SBIS3.CONTROLS.OperationsPanel', 'js!SBIS3.CONTROLS.TreeDataGridView', 'js!SBIS3.CONTROLS.BackButton', 'js!SBIS3.CONTROLS.OperationMerge', 'js!SBIS3.CONTROLS.MergeAction'],
    function(CompoundControl, dotTplFn, ComponentBinder) {
    /**
     * SBIS3.CONTROLS.Demo.MyOperationsPanel
     * @class SBIS3.CONTROLS.Demo.MyOperationsPanel
     * @extends $ws.proto.CompoundControl
     */
    var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyOperationsPanel.prototype */{
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {

            }
        },
        $constructor: function() {
            $ws.single.CommandDispatcher.declareCommand(this, 'mergeItems', this._mergeItems);
        },

        init: function() {
            moduleClass.superclass.init.call(this);
            var panelsButton = this.getChildControlByName('PanelsButton'),
                mergeAction = this.getChildControlByName('MergeAction'),
                operationsPanel = this.getChildControlByName('OperationsPanel'),
                dataGridView = this.getChildControlByName('DataGridView'),
                breadCrumbs = this.getChildControlByName('BreadCrumbs'),
                backButton = this.getChildControlByName('BackButton'),
                componentBinder = new ComponentBinder({
                    view: dataGridView,
                    operationPanel: operationsPanel,
                    breadCrumbs: breadCrumbs,
                    backButton: backButton
                });
            componentBinder.bindOperationPanel();
            componentBinder.bindBreadCrumbs();
            panelsButton.setLinkedPanel(operationsPanel);
            mergeAction.setDataSource(dataGridView.getDataSource());
        },
        _mergeItems: function(items) {
            var mergeAction = this.getChildControlByName('MergeAction');
            if (items.length > 1) {
                mergeAction.execute({
                    items: items
                });
            }
        },
        _markCaptionRender: function(count) {
            if (count) {
                return 'Выбрано(' + count + ')';
            } else {
                return 'Выбрать'
            }
        }
    });
    return moduleClass;
});
