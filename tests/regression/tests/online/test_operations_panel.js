var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.OperationsPanel Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_operationspanel_online.html')

            .setCaptureElements('.sbis3-TestMassOperationsPanel____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="OperationsPanel 1"]', 40000);
                this.panel_open = find('[name="OperationsPanel 1"] .controls__operations-panel__closed');
                this.select_all = find('.controls__operations-panel__wrapper .controls-CheckBox__icon');
                this.deleted_checkbox = find('[data-id="3"] .controls-DataGrid__td__checkBox');
                this.dropdown_link = find('[data-id="operationsMark"] .controls-Link__field');
                this.erase = find('.controls__operations-panel__actions .icon-Erase');
            })

            .capture('plain')

            .capture('opened', function (actions) {
                actions.click(this.panel_open);
                actions.wait(1000);
            })

            .capture('all selected', function (actions) {
                actions.click(this.select_all);
            })

            .capture('half selected', function (actions) {
                actions.click(this.deleted_checkbox);
            })

            .capture('dropdown link hovered', function (actions) {
                actions.mouseMove(this.dropdown_link);
            })

            .capture('dropdown_menu opened', function (actions) {
                actions.click(this.dropdown_link);
                actions.wait(1000);
            })

            .capture('operation button hovered', function (actions) {
                actions.click(this.dropdown_link);
                actions.mouseMove(this.erase);
            })
    });
});