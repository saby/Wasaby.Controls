define('js!SBIS3.CONTROLS.Demo.MyOperationsPanel', [
    'js!SBIS3.CORE.CompoundControl',
    'html!SBIS3.CONTROLS.Demo.MyOperationsPanel',
    'js!SBIS3.CONTROLS.ComponentBinder',
    'css!SBIS3.CONTROLS.Demo.MyOperationsPanel',
    'js!SBIS3.CONTROLS.OperationsPanelButton',
    'js!SBIS3.CONTROLS.OperationsPanel',
    'js!SBIS3.CONTROLS.TreeDataGridView',
    'js!SBIS3.CONTROLS.BackButton',
    'js!SBIS3.CONTROLS.Action.List.Sum'],
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
        init: function() {
            moduleClass.superclass.init.call(this);
            var panelsButton = this.getChildControlByName('PanelsButton'),
                operationsPanel = this.getChildControlByName('OperationsPanel'),
                dataGridView = this.getChildControlByName('DataGridView'),
                breadCrumbs = this.getChildControlByName('BreadCrumbs'),
                backButton = this.getChildControlByName('BackButton'),
                actionSum = this.getChildControlByName('ActionSum'),
                componentBinder = new ComponentBinder({
                    view: dataGridView,
                    operationPanel: operationsPanel,
                    breadCrumbs: breadCrumbs,
                    backButton: backButton
                });
            componentBinder.bindOperationPanel(true);
            componentBinder.bindBreadCrumbs();
            panelsButton.setLinkedPanel(operationsPanel);
            actionSum.setLinkedObject(dataGridView);
            $ws.single.CommandDispatcher.declareCommand(this, 'sumItems', function() {
                actionSum.execute({});
            });
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
