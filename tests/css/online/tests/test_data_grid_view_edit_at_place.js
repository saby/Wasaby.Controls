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
});