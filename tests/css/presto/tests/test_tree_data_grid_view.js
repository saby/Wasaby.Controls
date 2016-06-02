/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.TreeDataGridView Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.data2 = find('[data-id="2"]');
				this.data4_expand = find('[data-id="4"] .controls-TreeView__expand');
				this.data6 = find('[data-id="6"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_row', function (actions) {
                actions.mouseMove(this.data2);
				actions.wait(1000);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
				actions.wait(1000);
            })
			
			.capture('opened_folder', function (actions) {
                actions.click(this.data4_expand);
				actions.wait(1000);
            })
    });
	
	gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.data2 = find('[data-id="2"]');
				this.data6 = find('[data-id="6"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGridView 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_row', function (actions) {
                actions.mouseMove(this.data2);
				actions.wait(1000);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
				actions.wait(1000);
            })
    });

    gemini.suite('empty_data', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
    gemini.suite('disabled_empty_data', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGridView 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('ellipsis_column', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.data2 = find('[data-id="2"]');
				this.data4_expand = find('[data-id="4"] .controls-TreeView__expand');
				this.data6 = find('[data-id="6"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('ellipsis_column_and_arrow_handler', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.data2 = find('[data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.data2);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
            })
    });
});*/