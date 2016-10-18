var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.OperationsPanel Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_operations_panel_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
                this.open_button = find('.controls-OperationsPanelButton__icon');
                this.select_all = find('.controls-OperationsMark-checkBox > .controls-CheckBox__icon')
				this.data4 = find('[data-id="4"] .controls-ListView__itemCheckBox');
				this.data6 = find('[data-id="6"] .controls-ListView__itemCheckBox');
				this.mark = find('[data-id="markOperations"]');
				this.print = find('.controls-operationsPanel__actionType-mass');
				this.invert = find('[data-id="invertSelection"]');
            })

            .capture('plain')

            .capture('hovered_open_button', function (actions) {
                actions.mouseMove(this.open_button);
            })

            .capture('opened', function (actions) {
                actions.click(this.open_button);
                actions.wait(1000);
            })
			
			.capture('hovered_custom_operation', function (actions) {
                actions.mouseMove(this.print);
            })
			
			.capture('selected_half', function (actions) {
                actions.click(this.data4);
				actions.click(this.data6);
            })

            .capture('selected_all', function (actions) {
                actions.click(this.select_all);
				actions.click(this.select_all);
            })
			
			.capture('hovered_mark_operations', function (actions) {
                actions.mouseMove(this.mark);
            })
			
			.capture('opened_mark_operations_menu', function (actions) {
                actions.click(this.mark);
            })
			
			.capture('hovered_mark_operations_menu_item', function (actions) {
                actions.mouseMove(this.invert);
            })
    });
});