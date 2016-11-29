var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DataGridEditAtPlace Online', function () {

	gemini.suite('row_template', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимое_bind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
			
			.capture('toolbar_fix', function (actions) {
                actions.mouseMove(this.item7);
            })
    });
	
	gemini.suite('text_area_in_editor', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.editor_input = find('[sbisname="Содержимоеbind"] textarea')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[sbisname="Содержимоеbind"] textarea', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('rich_editor_in_editor', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_15.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.editor_input = find('[sbisname="Содержимоеbind"] .controls-RichEditor__editorFrame')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[sbisname="Содержимоеbind"] .controls-RichEditor__editorFrame', 2000);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

	gemini.suite('add_new_data_in_folder', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.item1 = find('[sbisname="browserView"] [data-id="1"]');
				this.item1_expander = find('[sbisname="browserView"] [data-id="1"] .controls-TreeView__expand');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.editor_input = find('[sbisname="TextBoxAddInPlace1"] input')
				this.add = find('[sbisname="addItemIn__1"] .controls-Link__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.item1_expander);
				actions.waitForElementToShow('[sbisname="addItemIn__1"] .controls-Link__field', 2000);
				actions.click(this.add);
				actions.waitForElementToShow('[sbisname="TextBoxAddInPlace1"] input', 2000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });
	
	gemini.suite('row_template_in_folder', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.item3 = find('[sbisname="browserView"] [data-id="3"]');
				this.item1_expander = find('[sbisname="browserView"] [data-id="1"] .controls-TreeView__expand');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.editor_input = find('[sbisname="TextBoxAddInPlace1"] input')
            })

            .capture('open_folder', function (actions) {
                actions.click(this.item1_expander);
				actions.waitForElementToShow('[sbisname="browserView"] [data-id="3"]', 2000);				
            })
			
			.capture('open_editor', function (actions) {
				actions.click(this.item3);
				actions.waitForElementToShow('[sbisname="TextBoxAddInPlace1"] input', 2000);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.editor_input, gemini.DELETE);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })			
    });
	
	gemini.suite('row_template_add_new_data', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item15 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимое_bind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item15);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
    });

	gemini.suite('column_template', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
			
			.capture('toolbar_fix', function (actions) {
                actions.mouseMove(this.item7);
            })
    });
	
	gemini.suite('column_template_add_new_data', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item15 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item15);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
    });
	
	gemini.suite('row_template_another_toolbar', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимое_bind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
			
			.capture('toolbar_fix', function (actions) {
                actions.mouseMove(this.item7);
            })
    });
	
	gemini.suite('row_template_add_new_data_another_toolbar', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item15 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимое_bind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item15);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
    });
	
	gemini.suite('column_template_another_toolbar', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
			
			.capture('toolbar_fix', function (actions) {
                actions.mouseMove(this.item7);
            })
    });
	
	gemini.suite('column_template_add_new_data_another_toolbar', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item15 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item15);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
    });
	/*
	gemini.suite('text_box_ellipsis_text', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_6.html').skip('firefox').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item8 = find('[sbisname="ТипНоменклатуры"] [data-id="8"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('with_ellipsis_text', function (actions) {
                actions.click(this.item8);
				actions.waitForElementToShow('[sbisname="Содержимоеbind"] input', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });*/

	gemini.suite('item_actions_in_edit_at_place', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item5 = find('[sbisname="ТипНоменклатуры"] [data-id="5"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item5);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('without_delete_on_add_at_place', function (actions) {
                actions.click(this.item7);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('edit_at_place_and_multeselect_false', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_9.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item5 = find('[sbisname="ТипНоменклатуры"] [data-id="5"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимое_bind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item5);
				actions.wait(2000);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('items_actions_on_column_template_3', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_19.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item4 = find('[sbisname="ТипНоменклатуры"] [data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancel = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="withoutNDS_bind"] input')
            })

            .capture('hovered_row', function (actions) {
                actions.mouseMove(this.item4);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item4);
				actions.wait(2000);
				actions.mouseMove(this.input);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });
	
	gemini.suite('add_new_data_in_folder_top', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_10.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.item1 = find('[sbisname="browserView"] [data-id="1"]');
				this.item1_expander = find('[sbisname="browserView"] [data-id="1"] .controls-TreeView__expand');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.editor_input = find('[sbisname="TextBoxAddInPlace1"] input')
				this.add = find('[sbisname="addItemIn__1"] .controls-Link__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.item1_expander);
				actions.waitForElementToShow('[sbisname="addItemIn__1"] .controls-Link__field', 2000);
				actions.click(this.add);
				actions.waitForElementToShow('[sbisname="TextBoxAddInPlace1"] input', 2000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });
	/*
	gemini.suite('add_and_edit_again', function (test) {

        test.setUrl('/integration_datagrid_edit_at_place_19.html').skip('firefox').setCaptureElements('[sbisname="ТипНоменклатуры"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
				this.focus = find('[sbisname="Фокус"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input');
				this.save = find('[title="Сохранить"]');
				this.data = find('.controls-DataGridView__tbody tr:nth-child(1)');
				this.clearData = find('[sbisname="Данные"] .controls-Button__text');
            })

            .capture('plain', function (actions) {
				actions.wait(150);
				actions.executeJS(function (window) {
                    window.$('[sbisname="Данные"] .controls-Button__text').click();
                });
				actions.click(this.clearData);
				actions.wait(350);
                actions.click(this.focus);
            })

			.capture('begin_add', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ТипНоменклатуры').sendCommand('beginAdd');
                });
				actions.waitForElementToShow('[sbisname="Содержимоеbind"] input', 2000)
				actions.waitForElementToShow('[title="Сохранить"]');
				actions.sendKeys(this.editor_input, 'test')
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.ARROW_LEFT)
            })

			.capture('confirm_adding', function (actions) {
                actions.sendKeys(this.editor_input, gemini.ENTER)
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ТипНоменклатуры').reload({});
                });
				actions.wait(250);
            })
			
			.capture('open_editor', function (actions) {
                actions.executeJS(function (window) {
                    window.$('.controls-DataGridView__tbody tr:first').click();
                });
				actions.wait(500);
				actions.click('[sbisname="Содержимоеbind"] input');
				actions.sendKeys('[sbisname="Содержимоеbind"] input', gemini.SHIFT+gemini.HOME);
            })
			
			.after(function (actions, find) {
				actions.wait(150);
				actions.executeJS(function (window) {
                    window.$('[sbisname="Данные"] .controls-Button__text').click();
                });
				actions.click(this.clearData);
				actions.wait(350);
            })
    });*/

	gemini.suite('editor_with_combobox', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_11.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item4 = find('[sbisname="ТипНоменклатуры"] [data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.box = find('[sbisname="Содержимоеbind"]')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item4);
				actions.wait(500);
				actions.click('[sbisname="Содержимоеbind"] .js-controls-TextBox__field');
				actions.sendKeys('[sbisname="Содержимоеbind"] .js-controls-TextBox__field', gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('items_actions_on_column_template', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_13.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('items_actions_on_column_template_and_round_border', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_20.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('items_actions_on_column_template_2', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_14.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				this.item7 = find('[sbisname="ТипНоменклатуры"] [data-id="7"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
				this.editor_input = find('[sbisname="Содержимоеbind"] input')
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });
	/*
    gemini.suite('result_position', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_76.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.add_top = '[sbisname="Добавить сверху"]';
				this.add_bot = '[sbisname="Добавить снизу"]';
				this.eip_input = '[sbisname="Номер_bind"]';
				this.eip_input2 = '[sbisname="Цена_bind"]';
            })

            .capture('add_top', function (actions) {
                actions.click(this.add_top);
				actions.waitForElementToShow(this.eip_input);
				actions.waitForElementToShow(this.eip_input2);
            })

			.capture('add_bottom', function (actions) {
				actions.sendKeys(this.eip_input, gemini.ESC);
				actions.executeJS(function (window) {
                    window.$('[sbisname="DataGridView 1"]').wsControl()._options.resultsPosition = "bottom";
					window.$('[sbisname="DataGridView 1"]').wsControl().reload();
                });
                actions.click(this.add_bot);
            })
    });*/
});