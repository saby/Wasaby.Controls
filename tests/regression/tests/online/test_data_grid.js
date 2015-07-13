var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DataGrid Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_datagrid_online.html').setCaptureElements('[name="DataGrid 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 1"]', 40000);
                this.grid = find('[name="DataGrid 1"]');
                this.grid3 = find('[name="DataGrid 3"]');
                this.checkbox1 = find('[name="DataGrid 1"] [data-id="Иван"] .controls-ListView__itemCheckBox');
                this.item2 = find('[name="DataGrid 1"] [data-id="Иван"] .controls-DataGrid__td:nth-child(2)');
            })

            .capture('plain')

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.item2);
                actions.wait(500);
            })

            .capture('selected item', function (actions) {
                actions.click(this.checkbox1);
                actions.mouseMove(this.grid3);
                actions.wait(500);
            })
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_datagrid_online.html').setCaptureElements('[name="DataGrid 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 1"]', 40000);
                this.grid = find('[name="DataGrid 1"]');
                this.grid3 = find('[name="DataGrid 3"]');
                this.checkbox1 = find('[name="DataGrid 1"] [data-id="Иван"] .controls-ListView__itemCheckBox');
                this.item2 = find('[name="DataGrid 1"] [data-id="Иван"] .controls-DataGrid__td:nth-child(2)');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGrid 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.item2);
                actions.wait(500);
            })

            .capture('selected item', function (actions) {
                actions.click(this.checkbox1);
                actions.mouseMove(this.grid3);
                actions.wait(500);
            })
    });

    gemini.suite('empty', function (test) {

        test.setUrl('/regression_datagrid_online.html')

            .setCaptureElements('[name="DataGrid 2"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 2"]', 40000);
                this.grid = find('[name="DataGrid 2"]');
            })

            .capture('plain')
    });

    gemini.suite('disabled_empty', function (test) {

        test.setUrl('/regression_datagrid_online.html').setCaptureElements('[name="DataGrid 2"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 2"]', 40000);
                this.grid = find('[name="DataGrid 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGrid 2').setEnabled(false);
                });
            })

            .capture('plain')
    });

    gemini.suite('no_select', function (test) {

        test.setUrl('/regression_datagrid_online_2.html').setCaptureElements('[name="DataGrid 5"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 5"]', 40000);
                this.grid = find('[name="DataGrid 5"]');
                this.grid3 = find('[name="DataGrid 3"]');
                this.checkbox1 = find('[name="DataGrid 5"] [data-id="Иван"]');
                this.checkbox2 = find('[name="DataGrid 5"] [data-id="Сидор"] .controls-ListView__itemCheckBox');
                this.item2 = find('[name="DataGrid 5"] [data-id="Иван"] .controls-DataGrid__td:nth-child(2)');
            })

            .capture('plain')

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.item2);
                actions.wait(500);
            })
    });

    gemini.suite('disable_no_select', function (test) {

        test.setUrl('/regression_datagrid_online_2.html').setCaptureElements('[name="DataGrid 5"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 5"]', 40000);
                this.grid = find('[name="DataGrid 5"]');
                this.grid3 = find('[name="DataGrid 3"]');
                this.checkbox1 = find('[name="DataGrid 5"] [data-id="Иван"]');
                this.item2 = find('[name="DataGrid 5"] [data-id="Иван"] .controls-DataGrid__td:nth-child(2)');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGrid 5').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.item2);
                actions.wait(500);
            })
    });

    gemini.suite('without_header', function (test) {

        test.setUrl('/regression_datagrid_online.html').setCaptureElements('[name="DataGrid 3"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 3"]', 40000);
                this.grid = find('[name="DataGrid 3"]');
                this.grid1 = find('[name="DataGrid 1"]');
                this.checkbox1 = find('[name="DataGrid 3"] [data-id="Иван"] .controls-ListView__itemCheckBox');
                this.item2 = find('[name="DataGrid 3"] [data-id="Иван"] .controls-DataGrid__td:nth-child(2)');
            })

            .capture('plain')

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.item2);
                actions.wait(500);
            })

            .capture('selected item', function (actions) {
                actions.click(this.checkbox1);
                actions.mouseMove(this.grid1);
                actions.wait(500);
            })
    });

    gemini.suite('disable_without_header', function (test) {

        test.setUrl('/regression_datagrid_online.html').setCaptureElements('[name="DataGrid 3"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DataGrid 3"]', 40000);
                this.grid = find('[name="DataGrid 3"]');
                this.grid1 = find('[name="DataGrid 1"]');
                this.checkbox1 = find('[name="DataGrid 3"] [data-id="Иван"] .controls-ListView__itemCheckBox');
                this.item2 = find('[name="DataGrid 3"] [data-id="Иван"] .controls-DataGrid__td:nth-child(2)');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DataGrid 3').setEnabled(true);
                });
            })

            .capture('plain')

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.item2);
                actions.wait(500);
            })

            .capture('selected item', function (actions) {
                actions.click(this.checkbox1);
                actions.mouseMove(this.grid1);
                actions.wait(500);
            })
    });

});