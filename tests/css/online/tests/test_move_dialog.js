gemini.suite('SBIS3.CONTROLS.MoveDialog Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_move_dialog_online.html').setCaptureElements('body')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGridView 1"]';
                this.item1_box = '[data-id="1"] .controls-ListView__itemCheckBox';
                this.move = '[data-id="move"] i';
				this.ok = '[sbisname="MoveDialogTemplate-moveButton"]';
				this.close = '.ws-window-titlebar-action.close';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item1_box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.item1_box);
				actions.wait(500);
				actions.waitForElementToShow(this.move, 5000);
                actions.click(this.move);
                actions.waitForElementToShow(this.ok, 5000);
				actions.waitForElementToShow(this.close, 5000);
            })
    });

	gemini.suite('folder_with_and_without_arrow', function (test) {

        test.setUrl('/regression_move_dialog_online_2.html').setCaptureElements('body')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGridView 1"]';
                this.item1_box = '[data-id="1"] .controls-ListView__itemCheckBox';
                this.move = '[data-id="move"] i';
				this.ok = '[sbisname="MoveDialogTemplate-moveButton"]';
				this.close = '.ws-window-titlebar-action.close';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item1_box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.item1_box);
				actions.wait(500);
				actions.waitForElementToShow(this.move, 5000);
                actions.click(this.move);
                actions.waitForElementToShow(this.ok, 5000);
				actions.waitForElementToShow(this.close, 5000);
            })
    });

    gemini.suite('with_ellipsis', function (test) {

        test.setUrl('/regression_move_dialog_online_3.html').setCaptureElements('body')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGridView 1"]';
                this.item1_box = '[data-id="1"] .controls-ListView__itemCheckBox';
                this.move = '[data-id="move"] i';
				this.ok = '[sbisname="MoveDialogTemplate-moveButton"]';
				this.close = '.ws-window-titlebar-action.close';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item1_box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.item1_box);
				actions.wait(500);
				actions.waitForElementToShow(this.move, 5000);
                actions.click(this.move);
                actions.waitForElementToShow(this.ok, 5000);
				actions.waitForElementToShow(this.close, 5000);
            })
    });
});