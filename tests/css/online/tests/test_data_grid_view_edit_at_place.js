gemini.suite('SBIS3.CONTROLS.DataGridEditAtPlace Online', function () {
	
	gemini.suite('row_template', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.dgv = '[sbisname="Nomenclature"]';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
				this.item7 = '[sbisname="Nomenclature"] [data-id="7"]';
                this.input = '[name="TextBox 1"] input';
				this.cancel = '[title="Отмена"]';
				this.save = '[title="Сохранить"]';
				this.editor_input = '[sbisname="bind_text"] input';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.waitForElementToShow(this.cancel, 5000);
				actions.waitForElementToShow(this.save, 5000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('hovered_cancel', function (actions) {
                actions.mouseMove(this.cancel);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
			
			.capture('toolbar_fix', function (actions) {
                actions.mouseMove(this.item7);
            })
			
			.capture('add_item', function (actions) {                
				actions.click(this.item7);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('text_area_in_editor', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
				this.input = '[name="TextBox 1"] input';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
				this.editor_input = '[sbisname="bind_text"] textarea';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('rich_editor_in_editor', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_15.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
				this.input = '[name="TextBox 1"] input';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
				this.editor_input = '[sbisname="bind_text"] .controls-RichEditor__editorFrame';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.wait(500);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });
	
	gemini.suite('add_new_data_in_folder', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_5.html').setCaptureElements('.capture')

            .before(function (actions) {				
				
				this.dgv = '[sbisname="browserView"]';
				this.input = '[name="TextBox 1"] input';
				this.item1 = '[sbisname="browserView"] [data-id="1"]';
				this.item1_expander = '[sbisname="browserView"] [data-id="1"] .controls-TreeView__expand';
                this.item3 = '[sbisname="browserView"] [data-id="3"]';
				this.editor_input = '[sbisname="TextBoxAddInPlace1"] input'
				this.add = '[sbisname="addItemIn__1"]';
				this.add_2 = '[sbisname="addItemIn__2"]';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.item1_expander);
				actions.waitForElementToShow(this.add, 5000);
				actions.waitForElementToShow(this.add_2, 5000);
				actions.click(this.add);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
			
			.capture('open_editor', function (actions) {
				actions.sendKeys(this.editor_input, gemini.ESCAPE);
				actions.click(this.item3);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.editor_input, gemini.DELETE);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('add_in_top', function (actions) {
                actions.sendKeys(this.editor_input, gemini.ESCAPE);
				actions.click(this.add_2);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('column_template', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
				this.item7 = '[sbisname="Nomenclature"] [data-id="7"]';
                this.input = '[name="TextBox 1"] input';
				this.cancel = '[title="Отмена"]';
				this.save = '[title="Сохранить"]';
				this.editor_input = '[sbisname="bind_text"] input';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('toolbar_fix', function (actions) {
                actions.mouseMove(this.item7);
            })
			
			.capture('add_item', function (actions) {
                actions.click(this.item7);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('row_template_another_toolbar', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_3.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.dgv = '[sbisname="Nomenclature"]';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
				this.item7 = '[sbisname="Nomenclature"] [data-id="7"]';
                this.input = '[name="TextBox 1"] input';
				this.cancel = '[title="Отмена"]';
				this.save = '[title="Сохранить"]';
				this.editor_input = '[sbisname="bind_text"] input';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.waitForElementToShow(this.cancel, 5000);
				actions.waitForElementToShow(this.save, 5000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('toolbar_fix', function (actions) {
                actions.mouseMove(this.item7);
            })
			
			.capture('add_item', function (actions) {                
				actions.click(this.item7);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
    });	
	
	gemini.suite('column_template_another_toolbar', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
				this.item7 = '[sbisname="Nomenclature"] [data-id="7"]';
                this.input = '[name="TextBox 1"] input';
				this.cancel = '[title="Отмена"]';
				this.save = '[title="Сохранить"]';
				this.editor_input = '[sbisname="bind_text"] input';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
			
			.capture('toolbar_fix', function (actions) {
                actions.mouseMove(this.item7);
            })
			
			.capture('add_item', function (actions) {
                actions.click(this.item7);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.sendKeys(this.editor_input, gemini.RETURN);
				actions.sendKeys(this.editor_input, 'Тест');
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.input);
            })
    });

    gemini.suite('edit_at_place_and_multeselect_false', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_19.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
                this.item4 = '[sbisname="Nomenclature"] [data-id="4"]';
                this.input = '[name="TextBox 1"] input';
				this.editor_input = '[sbisname="withoutNDS_bind"] input';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('hovered_row', function (actions) {
                actions.mouseMove(this.item4);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item4);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.mouseMove(this.input);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

	gemini.suite('editor_with_combobox', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_11.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
                this.item4 = '[sbisname="Nomenclature"] [data-id="4"]';
                this.input = '[name="TextBox 1"] input';
				this.editor_input = '[sbisname="bind_text"] input';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item4);
				actions.waitForElementToShow(this.editor_input, 5000);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('items_actions_on_column_template', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_13.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
                this.input = '[name="TextBox 1"] input';
				this.editor_input = '[sbisname="bind_text"] input';
				this.cancel = '[title="Отмена"]';
				this.save = '[title="Сохранить"]';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('items_actions_on_column_template_and_round_border', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_20.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
                this.input = '[name="TextBox 1"] input';
				this.editor_input = '[sbisname="bind_text"] input';
				this.cancel = '[title="Отмена"]';
				this.save = '[title="Сохранить"]';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('items_actions_on_column_template_2', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_14.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.dgv = '[sbisname="Nomenclature"]';
                this.item3 = '[sbisname="Nomenclature"] [data-id="3"]';
                this.input = '[name="TextBox 1"] input';
				this.editor_input = '[sbisname="bind_text"] input';
				this.cancel = '[title="Отмена"]';
				this.save = '[title="Сохранить"]';
				
				actions.waitForElementToShow(this.dgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow(this.cancel, 2000);
				actions.waitForElementToShow(this.save, 2000);
				actions.click(this.editor_input);
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })
    });
});