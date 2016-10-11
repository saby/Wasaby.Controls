gemini.suite('SBIS3.CONTROLS.DataGridView Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_data_grid_view_online.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
                this.data1_box = '[data-id="1"] .controls-ListView__itemCheckBox';
				this.data2 = '[data-id="2"]';
				this.data6 = '[data-id="6"]';
				this.delete_btn = '[data-id="delete"]';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_row', function (actions) {
                actions.mouseMove(this.data2);
				actions.waitForElementToShow(this.delete_btn, 5000);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
				actions.waitForElementToShow(this.selected, 5000);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGridView 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered_row', function (actions) {
                actions.mouseMove(this.data2);
            })
			
			.capture('disabled_and_check_box_click', function (actions) {
                actions.click(this.data1_box);
            })
    });
	
	gemini.suite('has_separator', function (test) {

        test.setUrl('/regression_data_grid_view_online_6.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('empty_data', function (test) {

        test.setUrl('/regression_data_grid_view_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGridView 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('empty_data_with_footer', function (test) {

        test.setUrl('/regression_data_grid_view_online_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGridView 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('ellipsis_column', function (test) {

        test.setUrl('/regression_data_grid_view_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

	gemini.suite('with_part_scroll', function (test) {

        test.setUrl('/regression_data_grid_view_online_5.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.dgv = '[name="DataGrid 1"]'
				this.data2 = '[data-id="2"]';
				this.data6 = '[data-id="6"]';
				this.arrow_left = '.controls-DataGridView__PartScroll__arrowLeft';
				this.arrow_right = '.controls-DataGridView__PartScroll__arrowRight';
				this.thumb = '.controls-DataGridView__PartScroll__thumb';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.arrow_left, 5000);
				actions.waitForElementToShow(this.arrow_right, 5000);
            })

            .capture('plain')
			
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
	
	gemini.suite('data_grid_in_row', function (test) {

        test.setUrl('/regression_data_grid_view_online_8.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
				this.data2 = '[data-id="2"]';
				this.delete_btn = '[data-id="delete"]';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('hovered_row', function (actions) {
                actions.mouseMove(this.data2);
				actions.waitForElementToShow(this.delete_btn, 5000);
            })
    });
	
    gemini.suite('with_paging_and_pager_no_amout', function (test) {

        test.setUrl('/regression_data_grid_view_online_10.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
    gemini.suite('without_marker', function (test) {

        test.setUrl('/regression_data_grid_view_online_9.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
				this.data6 = '[data-id="6"]';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
	
	gemini.suite('marker_right', function (test) {

        test.setUrl('/regression_data_grid_view_online_11.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
				this.data6 = '[data-id="6"]';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });

     gemini.suite('empty_data_and_load_indicator', function (test) {

        test.setUrl('/regression_data_grid_view_online_12.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[name="DataGridView 1"]'
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$('.controls-AjaxLoader').removeClass('ws-hidden');
                    window.$('.controls-AjaxLoader__LoadingIndicator').css('background', 'black')
                });
                actions.click(this.input);
            })
    });
});