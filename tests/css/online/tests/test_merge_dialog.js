var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.MergeDialogs Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_merge_dialog_online.html').skip('chrome').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="browserView"]', 40000);
                this.open_button = find('.controls-OperationsPanelButton__icon');
				actions.click(this.open_button);
				actions.wait(1000);
				this.item = find('[sbisname="MergeDialogTemplate__treeDataGridView"] [data-id="9"] .controls-RadioButton');
				this.close = find('.ws-window-titlebar-action.close');
				this.apply_merge = find('[sbisname="MergeDialogTemplate-mergeButton"] .controls-Button__text');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').expandNode(1);
					window.$ws.single.ControlStorage.getByName('browserView').expandNode(4);
					window.$ws.single.ControlStorage.getByName('browserView').expandNode(6);
					window.$ws.single.ControlStorage.getByName('browserView').setSelectedKeys([2,3,5,7,8,9]);
                });
				actions.waitForElementToShow('[data-id="merge"]', 1000);
				this.merge = find('[data-id="merge"]')
            })

            .capture('plain', function (actions) {
				actions.click(this.merge);
				actions.waitForElementToShow('.ws-window-titlebar-action.close', 1000);
				actions.click(this.item);
            })

			.capture('hovered_close', function (actions) {
				actions.mouseMove(this.close);
            })
			
			.capture('hovered_merge', function (actions) {
				actions.mouseMove(this.apply_merge);
            })
    });
	
	gemini.suite('with_custom_template', function (test) {

        test.setUrl('/regression_merge_dialog_online_2.html').skip('chrome').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="browserView"]', 40000);
                this.open_button = find('.controls-OperationsPanelButton__icon');
				actions.click(this.open_button);
				actions.wait(1000);
				this.item = find('[sbisname="MergeDialogTemplate__treeDataGridView"] [data-id="9"] .controls-RadioButton');
				this.close = find('.ws-window-titlebar-action.close');
				this.apply_merge = find('[sbisname="MergeDialogTemplate-mergeButton"] .controls-Button__text');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').expandNode(1);
					window.$ws.single.ControlStorage.getByName('browserView').expandNode(4);
					window.$ws.single.ControlStorage.getByName('browserView').expandNode(6);
					window.$ws.single.ControlStorage.getByName('browserView').setSelectedKeys([2,3,5,7,8,9]);
                });
				actions.waitForElementToShow('[data-id="merge"]', 1000);
				this.merge = find('[data-id="merge"]')
            })

            .capture('plain', function (actions) {
				actions.click(this.merge);
				actions.waitForElementToShow('.ws-window-titlebar-action.close', 1000);
				actions.click(this.item);
            })

			.capture('hovered_close', function (actions) {
				actions.mouseMove(this.close);
            })
			
			.capture('hovered_merge', function (actions) {
				actions.mouseMove(this.apply_merge);
            })
    });
});