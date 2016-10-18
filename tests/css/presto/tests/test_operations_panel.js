gemini.suite('SBIS3.CONTROLS.OperationsPanel Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_operations_panel_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.dgv = '[name="DataGridView 1"]';
                this.open_button = '.controls-OperationsPanelButton__icon';
                this.select_all = '.controls-OperationsMark-checkBox > .controls-CheckBox__icon';
				this.data4 = '[data-id="4"] .controls-ListView__itemCheckBox';
				this.data6 = '[data-id="6"] .controls-ListView__itemCheckBox';
				this.mark = '[data-id="markOperations"]';
				this.print = '.controls-operationsPanel__actionType-mass';
				this.invert = '[data-id="invertSelection"]';
				
				actions.waitForElementToShow(this.dgv, 40000);
            })

            .capture('plain')

            .capture('hovered_open_button', function (actions) {
                actions.mouseMove(this.open_button);
            })

            .capture('opened', function (actions) {
                actions.click(this.open_button);
                actions.wait(500);
				actions.waitForElementToShow(this.mark, 5000);
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
				actions.waitForElementToShow(this.invert, 5000);
            })
			
			.capture('hovered_mark_operations_menu_item', function (actions) {
                actions.mouseMove(this.invert);
            })
    });
});