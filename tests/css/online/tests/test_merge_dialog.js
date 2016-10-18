gemini.suite('SBIS3.CONTROLS.MergeDialogs Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_merge_dialog_online.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.browser = '[name="browserView"]';				
                this.open_button = '.controls-OperationsPanelButton__icon';
				this.item9 = '[sbisname="MergeDialogTemplate__treeDataGridView"] [data-id="9"] .controls-RadioButton';
				this.merge = '[data-id="merge"] i';
				this.unload = '[data-id="unload"]';
				this.close = '.ws-window-titlebar-action.close';
				this.apply_merge = '[sbisname="MergeDialogTemplate-mergeButton"] .controls-Button__text';				
				
				actions.waitForElementToShow(this.browser, 40000);
            })

            .capture('plain', function (actions) {
				actions.click(this.open_button);
				actions.wait(1000);
				actions.waitForElementToShow(this.unload, 5000);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').expandNode(1);
					window.$ws.single.ControlStorage.getByName('browserView').expandNode(4);
					window.$ws.single.ControlStorage.getByName('browserView').expandNode(6);
					window.$ws.single.ControlStorage.getByName('browserView').setSelectedKeys([2,3,5,7,8,9]);
                });
				actions.waitForElementToShow(this.merge, 5000);
				actions.click(this.merge);
				actions.wait(1000);
				actions.waitForElementToShow(this.item9, 5000);
				actions.waitForElementToShow(this.close, 5000);
				actions.click(this.item9);
				actions.waitForElementToShow(this.apply_merge, 5000);
            })

			.capture('hovered_close', function (actions) {
				actions.mouseMove(this.close);
            })
			
			.capture('hovered_merge', function (actions) {
				actions.mouseMove(this.apply_merge);
            })
    });
	
	gemini.suite('with_custom_template', function (test) {

        test.setUrl('/regression_merge_dialog_online_2.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.browser = '[name="browserView"]';				
                this.open_button = '.controls-OperationsPanelButton__icon';
				this.item9 = '[sbisname="MergeDialogTemplate__treeDataGridView"] [data-id="9"] .controls-RadioButton';
				this.close = '.ws-window-titlebar-action.close';
				this.apply_merge = '[sbisname="MergeDialogTemplate-mergeButton"] .controls-Button__text';				
				this.merge = '[data-id="merge"] i';
				
				actions.waitForElementToShow(this.browser, 40000);
            })

            .capture('plain', function (actions) {
				actions.click(this.open_button);
				actions.wait(1000);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').expandNode(1);
					window.$ws.single.ControlStorage.getByName('browserView').expandNode(4);
					window.$ws.single.ControlStorage.getByName('browserView').expandNode(6);
					window.$ws.single.ControlStorage.getByName('browserView').setSelectedKeys([2,3,5,7,8,9]);
                });				
				actions.waitForElementToShow(this.merge, 5000);
				actions.click(this.merge);
				actions.wait(1000);
				actions.waitForElementToShow(this.item9, 5000);
				actions.waitForElementToShow(this.close, 5000);
				actions.click(this.item9);
				actions.waitForElementToShow(this.apply_merge, 5000);
            })
    });
});