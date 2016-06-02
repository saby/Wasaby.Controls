var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DataGridView Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_data_grid_view_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
                this.data2 = find('[data-id="2"]');
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
    });
	
	gemini.suite('has_separator', function (test) {

        test.setUrl('/regression_data_grid_view_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
                this.data2 = find('[data-id="2"]');
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
    });
	
	gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_data_grid_view_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
                this.data2 = find('[data-id="2"]');
				this.data6 = find('[data-id="6"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGridView 1').setEnabled(false);
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

        test.setUrl('/regression_data_grid_view_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('empty_data_with_footer', function (test) {

        test.setUrl('/regression_data_grid_view_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
    gemini.suite('disabled_empty_data', function (test) {

        test.setUrl('/regression_data_grid_view_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGridView 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('ellipsis_column', function (test) {

        test.setUrl('/regression_data_grid_view_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGridView 1"]', 40000);
                this.data2 = find('[data-id="2"]');
				this.data6 = find('[data-id="6"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

	gemini.suite('with_part_scroll', function (test) {

        test.setUrl('/regression_data_grid_view_online_5.html').skip('chrome').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 1"]', 40000);
                this.data2 = find('[data-id="2"]');
				this.data6 = find('[data-id="6"]');
				this.arrow_left = find('.controls-DataGridView__PartScroll__arrowLeft');
				this.arrow_right = find('.controls-DataGridView__PartScroll__arrowRight');
				this.thumb = find('.controls-DataGridView__PartScroll__thumb');
            })

            .capture('plain')

            .capture('hovered_row', function (actions) {
                actions.mouseMove(this.data2);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
            })
			
			.capture('hovered_disabled_left_arrow', function (actions) {
                actions.mouseMove(this.arrow_left);
            })
			
			.capture('hovered_right_arrow', function (actions) {
                actions.mouseMove(this.arrow_right);
            })
			
			.capture('hovered_thumb', function (actions) {
                actions.click(this.arrow_right);
				actions.mouseMove(this.thumb);
            })
			
			.capture('hovered_left_arrow', function (actions) {
                actions.mouseMove(this.arrow_left);
            })
			
			.capture('hovered_disabled_right_arrow', function (actions) {
                actions.mouseDown(this.thumb);
				actions.mouseMove(this.thumb, {'x': 500, 'y': 0});
				actions.mouseUp(this.thumb);
				actions.mouseMove(this.arrow_right);
            })			
    });
});