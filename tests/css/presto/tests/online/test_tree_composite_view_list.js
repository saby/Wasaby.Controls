/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.TreeCompositeViewList Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_tree_composite_view_list_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
				this.item4_checker = find('[data-id="4"] .controls-ListView__itemCheckBox');
				this.item6 = find('[data-id="6"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item6);
				actions.wait(1000);
            })

            .capture('selected_item', function (actions) {
                actions.click(this.item6);
				actions.wait(1000);
            })
			
			.capture('hovered_folder', function (actions) {
                actions.mouseMove(this.item4);
				actions.wait(1000);
            })

            .capture('selected_folder', function (actions) {
                actions.click(this.item4_checker);
				actions.wait(1000);
            })
    });
	
	gemini.suite('empty_data', function (test) {

        test.setUrl('/regression_tree_composite_view_list_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
    gemini.suite('disabled_empty_data', function (test) {

        test.setUrl('/regression_tree_composite_view_list_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
});*/