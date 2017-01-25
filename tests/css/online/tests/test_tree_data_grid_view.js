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
				actions.wait(500);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
				actions.wait(500);
            })
			
			.capture('opened_folder', function (actions) {
                actions.click(this.data4_expand);
				actions.wait(500);
            })
    });
	
	gemini.suite('with_edit_arrow', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_11.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.data4 = find('[data-id="4"]');
				this.arrow = find('.controls-TreeView__editArrow-container');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_folder', function (actions) {
                actions.mouseMove(this.data4);
				actions.wait(500);
            })

            .capture('hovered_edit_arrow', function (actions) {
                actions.mouseMove(this.arrow);
				actions.wait(500);
            })

			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGridView 1').setEnabled(false);
                });
            })

			.capture('disabled_and_hovered_edit_arrow', function (actions) {
				actions.mouseMove(this.arrow);
				actions.wait(500);
            })
    });

	gemini.suite('has_separator', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_9.html').setCaptureElements('.capture')

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
				actions.wait(500);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
				actions.wait(500);
            })
			
			.capture('opened_folder', function (actions) {
                actions.click(this.data4_expand);
				actions.wait(500);
            })
    });
	
	gemini.suite('cell_template', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.data2 = find('[data-id="2"]');
				this.data4_expand = find('[data-id="1"] .controls-TreeView__expand');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_row', function (actions) {
                actions.mouseMove(this.data2);
				actions.wait(500);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data2);
				actions.wait(500);
            })
			
			.capture('opened_folder', function (actions) {
                actions.click(this.data4_expand);
				actions.wait(500);
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
				actions.wait(500);
            })

            .capture('selected_row', function (actions) {
                actions.click(this.data6);
				actions.wait(500);
            })
			
			.capture('clicked_in_box', function (actions) {
                actions.click('[data-id="4"] .controls-ListView__itemCheckBox');
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
	
	gemini.suite('empty_data_with_footer', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_10.html').setCaptureElements('.capture')

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

        test.setUrl('/regression_tree_data_grid_view_online_4.html').skip('chrome').setCaptureElements('.capture')

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

        test.setUrl('/regression_tree_data_grid_view_online_5.html').skip('chrome').setCaptureElements('.capture')

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

	gemini.suite('with_part_scroll', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_7.html').skip('chrome').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGrid 1"]', 40000);
                this.data2 = find('[data-id="2"]');
				this.data6 = find('[data-id="6"] .controls-ListView__itemCheckBox');
				this.data6_folder = find('[data-id="6"]');
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

            .capture('opened_folder', function (actions) {
                actions.click(this.data4_expand);
            })
    });
	
	gemini.suite('with_folder_footer_template', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_12.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
				this.data4_expand = '[data-id="4"] .controls-TreeView__expand';
				this.data4 = '[data-id="4"]';
				this.data12_expand = '[data-id="12"] .controls-TreeView__expand';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('expanded', function (actions) {
                actions.click(this.data4_expand);
				actions.waitForElementToShow('[data-id="12"]', 2000);
				actions.click(this.data12_expand);
				actions.waitForElementToShow('[data-id="13"]', 2000);
				actions.click(this.input);
            })

            .capture('expanded_in_folder', function (actions) {
                actions.click(this.data4);
				actions.waitForElementToShow('[data-id="12"]', 2000);
				actions.click(this.data12_expand);
				actions.waitForElementToShow('[data-id="13"]', 2000);
				actions.click(this.input);
            })
    });

    gemini.suite('folder_footer_not_hidden', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_12.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
				this.data4_expand = '[data-id="4"] .controls-TreeView__expand';
				this.data4 = '[data-id="4"]';
				this.data12_expand = '[data-id="12"] .controls-TreeView__expand';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.data4_expand);
				actions.waitForElementToShow('[data-id="12"]', 2000);
				actions.executeJS(function (window) {
                    window.$('.controls-TreeDataGridView__folderFooterTmpl').addClass('ws-hidden')
                });
            })
    });
	
	gemini.suite('with_cell_template_and_float_left', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_13.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('expanded', function (actions) {
				actions.click(this.input);
            })
    });
	
	gemini.suite('with_cell_template_and_image', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_14.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('expanded', function (actions) {
				actions.click(this.input);
            })
    });

	gemini.suite('dots_on_ellipsis_column', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_4.html').skip('chrome').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.data1 = find('[data-id="1"]');
				this.data1_box = find('[data-id="1"] .controls-ListView__itemCheckBox');
				this.data3 = find('[data-id="3"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
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

        test.setUrl('/regression_tree_data_grid_view_online_15.html').skip('chrome').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('ellipsis_and_long_text_with_arrow', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_19.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.data1 = find('[data-id="1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.data1);
				actions.wait(500);
            })
    });

    gemini.suite('load_more_and_multiselect', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_65.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGridView 1"]', 40000);
                this.data1 = find('[data-id="1"]');
				this.data1_expand = find('[data-id="1"] .controls-TreeView__expand');
				this.more = '.controls-TreePager-container';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.data1_expand);
				actions.waitForElementToShow('[data-id="4"]', 5000);
				actions.waitForElementToShow('.controls-TreePager-container', 5000);
            })
    });
	
	gemini.suite('load_more', function (test) {

        test.setUrl('/regression_tree_data_grid_view_online_18.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TypeNomenclature"]', 40000);
                this.data1 = find('[data-id="1"]');
				this.data1_expand = find('[data-id="1"] .controls-TreeView__expand');
				this.more = '.controls-TreePager-container';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.data1_expand);
				actions.waitForElementToShow('[data-id="4"]', 5000);
				actions.waitForElementToShow('.controls-TreePager-container', 5000);
            })
			
			.capture('load_more', function (actions) {
                actions.click(this.more);
				actions.waitForElementToShow('[data-id="7"]', 5000);
				actions.waitForElementToShow('.controls-TreePager-container', 5000);
            })
			
			.capture('no_more', function (actions) {
                actions.click(this.more);
                actions.mouseMove(this.input);
				actions.waitForElementToShow('[data-id="9"]', 5000);
				actions.waitForElementToHide('.controls-TreePager-container', 5000);
            })
    });
});