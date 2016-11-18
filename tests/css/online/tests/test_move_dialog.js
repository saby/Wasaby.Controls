var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.MoveDialog Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_move_dialog_online.html').setCaptureElements('body')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.open_button = find('.controls-OperationsPanelButton__icon');
                this.item1 = find('[data-id="1"] .controls-ListView__itemCheckBox');
                this.move = find('[data-id="move"]')
            })

            .capture('plain', function (actions) {
                actions.click(this.item1);
				//actions.click(this.open_button);
				actions.wait(1000);
                actions.click(this.move);
                actions.wait(1000);
            })
    });

	gemini.suite('folder_with_and_without_arrow', function (test) {

        test.setUrl('/regression_move_dialog_online_2.html').setCaptureElements('body')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.open_button = find('.controls-OperationsPanelButton__icon');
                this.item1 = find('[data-id="1"] .controls-ListView__itemCheckBox');
                this.move = find('[data-id="move"]')
            })

            .capture('plain', function (actions) {
                actions.click(this.item1);
				//actions.click(this.open_button);
				actions.wait(1000);
                actions.click(this.move);
                actions.wait(1000);
            })
    });

    gemini.suite('with_ellipsis', function (test) {

        test.setUrl('/regression_move_dialog_online_3.html').skip('chrome').setCaptureElements('body')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.open_button = find('.controls-OperationsPanelButton__icon');
                this.item1 = find('[data-id="1"] .controls-ListView__itemCheckBox');
                this.move = find('[data-id="move"]')
            })

            .capture('plain', function (actions) {
                actions.click(this.item1);
				//actions.click(this.open_button);
				actions.wait(1000);
                actions.click(this.move);
                actions.wait(1000);
            })
    });
});