gemini.suite('SBIS3.CONTROLS.TreeDataGridView Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.data2 = '[data-id="2"]';
				this.data4_expand = '[data-id="4"] .controls-TreeView__expand';
				this.data6 = '[data-id="6"]';
				this.data14 = '[data-id="14"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.delete_btn = '[data-id="delete"]';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.tdgv, 40000);
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
			
			.capture('opened_folder', function (actions) {
                actions.click(this.data4_expand);
				actions.waitForElementToShow(this.delete_btn, 5000);
				actions.waitForElementToShow(this.data14, 5000);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGridView 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('with_edit_arrow', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_11.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.data4 = '[data-id="4"]';
				this.arrow = '.controls-TreeView__editArrow-container';
				this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('hovered_folder', function (actions) {
                actions.mouseMove(this.data4);
            })

            .capture('hovered_edit_arrow', function (actions) {
                actions.mouseMove(this.arrow);
            })

			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGridView 1').setEnabled(false);
                });
            })

			.capture('disabled_and_hovered_edit_arrow', function (actions) {
				actions.mouseMove(this.arrow);
            })
    });

	gemini.suite('has_separator', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_9.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('cell_template', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_6.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.data3 = '[data-id="3"]';
				this.data4_expand = '[data-id="1"] .controls-TreeView__expand';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })
			
			.capture('opened_folder', function (actions) {
                actions.click(this.data4_expand);
				actions.waitForElementToShow(this.data3, 5000);
				actions.click(this.input);
            })
    });

    gemini.suite('empty_data', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGridView 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('empty_data_with_footer', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_10.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGridView 1').setEnabled(false);
                });
            })
    });

	gemini.suite('ellipsis_column', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('ellipsis_column_and_arrow_handler', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_5.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.data4 = '[data-id="4"]';
				this.arrow = '.controls-ItemActions .controls-ItemActions__menu-button';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.data4);
				actions.waitForElementToShow(this.arrow, 5000);
            })
    });

	gemini.suite('with_part_scroll', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_7.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGrid 1"]';
				this.data2 = '[data-id="2"]';
				this.data6 = '[data-id="6"] .controls-ListView__itemCheckBox';
				this.data6_folder = '[data-id="6"]';
				this.arrow_left = '.controls-DataGridView__PartScroll__arrowLeft';
				this.arrow_right = '.controls-DataGridView__PartScroll__arrowRight';
				this.thumb = '.controls-DataGridView__PartScroll__thumb';
                
				actions.waitForElementToShow(this.tdgv, 40000);
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
			
			.capture('hovered_folder_and_ajax', function (actions) {
				actions.mouseMove(this.data6_folder);
				actions.executeJS(function (window) {
                    window.$('.controls-AjaxLoader').removeClass('ws-hidden');
					window.$('.controls-AjaxLoader__LoadingIndicator').remove();
                });
            })
    });
	
	gemini.suite('group_by', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_8.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.data4_expand = '[data-id="4"] .controls-TreeView__expand';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened_folder', function (actions) {
                actions.click(this.data4_expand);
            })
    });
	
	gemini.suite('with_folder_footer_template', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_12.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.data4_expand = '[data-id="4"] .controls-TreeView__expand';
				this.data4 = '[data-id="4"]';
				this.data12_expand = '[data-id="12"] .controls-TreeView__expand';
				this.data12 = '[data-id="12"]';
				this.data13 = '[data-id="13"]';
				
                actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('expanded', function (actions) {
                actions.click(this.data4_expand);
				actions.waitForElementToShow(this.data12, 5000);
				actions.click(this.data12_expand);
				actions.waitForElementToShow(this.data13, 5000);
				actions.click(this.input);
            })

            .capture('expanded_in_folder', function (actions) {
                actions.click(this.data4);
				actions.waitForElementToShow(this.data12, 5000);
				actions.click(this.data12_expand);
				actions.waitForElementToShow(this.data13, 5000);
				actions.click(this.input);
            })
    });
	
	gemini.suite('with_cell_template_and_float_left', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_13.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('expanded', function (actions) {
				actions.click(this.input);
            })
    });
	
	gemini.suite('with_cell_template_and_image', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_14.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('expanded', function (actions) {
				actions.click(this.input);
            })
    });

	gemini.suite('dots_on_ellipsis_column', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.data1 = '[data-id="1"]';
				this.data1_box = '[data-id="1"] .controls-ListView__itemCheckBox';
				this.data3 = '[data-id="3"]';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('with_checkbox_on', function (actions) {
                actions.mouseMove(this.data1);
				actions.click(this.data1_box);
				actions.mouseMove(this.data3);
            })

			.capture('hovered_row', function (actions) {
                actions.mouseMove(this.data1);
            })
    });

    gemini.suite('with_hidden_row', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_15.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('ellipsis_and_long_text_with_arrow', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_19.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.data1 = '[data-id="1"]';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.data1);
            })
    });
	
	gemini.suite('load_more', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_18.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="ТипНоменклатуры"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.data1_expand = '[data-id="0"] .controls-TreeView__expand';
				this.data4 = '[data-id="4"]';
				this.data7 = '[data-id="7"]';
				this.data9 = '[data-id="9"]';
				this.more = '.controls-TreePager-container';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.data1_expand);
				actions.waitForElementToShow(this.data4, 5000);
				actions.waitForElementToShow(this.more, 5000);
            })
			
			.capture('load_more', function (actions) {
                actions.click(this.more);
				actions.waitForElementToShow(this.data7, 5000);
				actions.waitForElementToShow(this.more, 5000);
            })
			
			.capture('no_more', function (actions) {
                actions.click(this.more);
				actions.waitForElementToShow(this.data9, 5000);
				actions.waitForElementToHide(this.more, 5000);
            })
    });
});