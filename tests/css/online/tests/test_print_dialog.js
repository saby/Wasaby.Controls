var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.PrintDialog Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_print_dialog_online.html').setCaptureElements('body')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
                this.open_button = find('.controls-OperationsPanelButton__icon');
				this.print = find('span[data-id="print"] .controls-Link__field');
				//this.print_count = find('[sbisname="controls-RadioButtons"] span[data-id="pickNum"] .controls-RadioButton__icon');
				//this.print_current = find('[sbisname="controls-RadioButtons"] span[data-id="current"] .controls-RadioButton__icon')
				this.execute = find('.ws-printdialog-print-button')
            })

            .capture('plain', function (actions) {
                actions.click(this.open_button);
				actions.wait(1000);
                actions.waitForElementToShow('span[data-id="print"] .icon-Print', 1000);
				actions.waitForElementToShow('span[data-id="print"] .controls-Link__field', 1000);
                actions.click(this.print);
				actions.waitForElementToShow('.ws-printdialog-print-button', 1000);
				actions.wait(2000);
                //actions.waitForElementToShow('[sbisname="controls-RadioButtons"] span[data-id="pickNum"]', 1000);
				//actions.waitForElementToShow('[sbisname="controls-RadioButtons"] span[data-id="current"]', 1000);
            })
			/*
            .capture('item_count', function (actions) {
                actions.click(this.print_count);
                actions.waitForElementToShow('[sbisname="controls-numberTextBox"]', 1000);
            })
			
			.capture('preview_window', function (actions) {
                actions.click(this.execute);
                actions.wait(2000);
            })*/
    });
});