gemini.suite('SBIS3.CONTROLS.PrintDialog Online', function () {

    gemini.suite('base', function (test) {
		
		// Скипаем Chrome т.к. там по умолчанию показывается стандартный диалог печати
        test.setUrl('/regression_print_dialog_online.html').skip('chrome').setCaptureElements('html')

            .before(function (actions) {
                
				this.dgv = '[name="DataGridView 1"]';				
                this.open_button = '.controls-OperationsPanelButton__icon';
				this.print = '[data-id="print"]';
				this.execute = '.ws-printdialog-print-button';
				this.title = '.ws-printdialog-titlebar .ws-window-title';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.open_button, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.open_button);
				actions.wait(500);
                actions.waitForElementToShow(this.print, 5000);
                actions.click(this.print);				
				actions.wait(500);
				actions.waitForElementToShow(this.title, 5000);
				actions.waitForElementToShow(this.execute, 5000);
            })
    });
});