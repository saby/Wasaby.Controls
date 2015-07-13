# -*- coding: utf-8 -*-
from atf import *
from pages.index import ComboBoxNew, ProgressBar, RadioGroupButton, CheckBoxGroup, Switcher


class TestProgressRadioButtonCheckBoxComboBoxSwitcher(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование новых контроллов"""

    conf = Config()
    disabled = 'ws-disabled'
    control_checked = 'controls-Checked__checked'
    vertical_radio = 'controls-ButtonGroup__vertical'
    middle = 'controls-ToggleButton__null'
    on = 'controls-Switcher__toggle__position-on'

    def test_01_progress_bar(self):
        """01. Тест проверки прогресс бара"""

        self.browser.open(self.config.SITE + '/integration_progressbar.html')
        self.browser.maximize_window()
        pb = ProgressBar(self)

        assert_that(pb.progress, is_displayed(), 'Страница /integration_progressbar.html не загрузилась', and_wait())
        assert_that(lambda: pb.progress.text, equal_to('0%'), 'Текст не тот который мы ожидали', and_wait())

        log('Проверяем изменение прогресса вверх')
        for data in range(1, 101):
            self.browser.execute_script("$ws.single.ControlStorage.getByName('ProgressBar 1')"
                                        ".setProgress({0});".format(data))
            assert_that(lambda: pb.progress.text, equal_to('{0}%'.format(data)),
                        'Текст не тот который мы ожидали', and_wait())

        log('Проверяем макисмально высокий порог')
        try:
            self.browser.execute_script("""$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(200);""")
        except:
            assert_that(lambda: pb.progress.text, equal_to('100%'), 'Текст не тот который мы ожидали', and_wait())

        log('Проверяем макисмально низкий порог')
        try:
            self.browser.execute_script("""$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(-50);""")
        except:
            assert_that(lambda: pb.progress.text, equal_to('100%'), 'Текст не тот который мы ожидали', and_wait())

        log('Проверяем изменение прогресса вниз')
        self.browser.execute_script("""$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(50);""")
        assert_that(lambda: pb.progress.text, equal_to('50%'), 'Текст не тот который мы ожидали', and_wait())

        log('Делаем контрол не активным')
        self.browser.execute_script("""$ws.single.ControlStorage.getByName('ProgressBar 1').setEnabled(false);""")
        assert_that(lambda: self.disabled in pb.progress.css_class, is_(True), 'Контрол не задизейблен', and_wait())

    def test_02_radiogroup_button(self):
        """02. Тест радиокнопок"""

        self.browser.open(self.config.SITE + '/integration_radiogroup.html')
        self.browser.maximize_window()
        rgb = RadioGroupButton(self)

        assert_that(rgb.radio1, is_displayed(), 'Страница /integration_radiogroup.html не открылась', and_wait())

        log('Проверяем, что ни одна радио кнопка не выбрана')
        assert_that(lambda: self.control_checked in rgb.radio1.css_class, is_(False), 'Радиокнопка выбрана', and_wait())
        assert_that(lambda: rgb.radio1.text, equal_to(' RadioButton 1'),
                    'Текст у кнопки должен быть другим', and_wait())
        assert_that(lambda: self.control_checked in rgb.radio2.css_class, is_(False), 'Радиокнопка выбрана', and_wait())
        assert_that(lambda: rgb.radio2.text, equal_to(' RadioButton 2'),
                    'Текст у кнопки должен быть другим', and_wait())
        assert_that(lambda: self.control_checked in rgb.radio3.css_class, is_(False),
                    'Радиокнопка выбрана', and_wait())
        assert_that(lambda: rgb.radio3.text, equal_to(' RadioButton 3'),
                    'Текст у кнопки должен быть другим', and_wait())
        assert_that(lambda: self.control_checked in rgb.radio4.css_class, is_(False),
                    'Радиокнопка выбрана', and_wait())
        assert_that(lambda: rgb.radio4.text, equal_to(' RadioButton 4'),
                    'Текст у кнопки должен быть другим', and_wait())

        log('Выбираем 1 кнопку')
        rgb.radio1.click()
        assert_that(lambda: self.control_checked in rgb.radio1.css_class, is_(True),
                    'Радиокнопка 1 не выбрана', and_wait())

        log('Выбираем 2 кнопку')
        rgb.radio2.click()
        assert_that(lambda: self.control_checked in rgb.radio1.css_class, is_(False),
                    'Радиокнопка 1 выбрана', and_wait())
        assert_that(lambda: self.control_checked in rgb.radio2.css_class, is_(True),
                    'Радиокнопка 2 не выбрана', and_wait())

        log('Проверяем, что 3 и 4 кнопка расположены вертикально')
        assert_that(lambda: self.vertical_radio in rgb.rgroup1.css_class, is_(False),
                    'радиогруппа 1 должна быть горизонтальной', and_wait())
        assert_that(lambda: self.vertical_radio in rgb.rgroup2.css_class, is_(True),
                    'радиогруппа 1 должна быть горизонтальной', and_wait())

        log('Выбираем 3 кнопку')
        rgb.radio3.click()
        assert_that(lambda: self.control_checked in rgb.radio3.css_class, is_(True),
                    'Радиокнопка 3 не выбрана', and_wait())

        log('Выбираем 4 кнопку')
        rgb.radio4.click()
        assert_that(lambda: self.control_checked in rgb.radio3.css_class, is_(False),
                    'Радиокнопка 3 выбрана', and_wait())
        assert_that(lambda: self.control_checked in rgb.radio4.css_class, is_(True),
                    'Радиокнопка 4 не выбрана', and_wait())

    def test_03_checkboxgroup_button(self):
        """03. Тест чекбоксы"""

        self.browser.open(self.config.SITE + '/integration_checkboxgroup.html')
        self.browser.maximize_window()
        cbg = CheckBoxGroup(self)

        assert_that(cbg.box1, is_displayed(), 'Страница /integration_checkboxgroup.html не открылась', and_wait())

        log('Выбираем 1 одиночный чекбокс')
        cbg.only_box1.click()
        assert_that(lambda: self.control_checked in cbg.only_box1.css_class, is_(True), 'Чекбокс не выбран', and_wait())

        log('Выбираем 2 одиночный чекбокс')
        cbg.only_box2.click()
        assert_that(lambda: self.control_checked in cbg.only_box2.css_class, is_(True), 'Чекбокс не выбран', and_wait())
        cbg.only_box2.click()
        assert_that(lambda: self.middle in cbg.only_box2.css_class, is_(True), 'Чекбокс не выбран', and_wait())

        log('Проверяем, что 1 и 2 группа горизонтальные')
        assert_that(lambda: self.vertical_radio in cbg.gbox1.css_class, is_(False), 'Группа 1 вертикальная', and_wait())
        assert_that(lambda: self.vertical_radio in cbg.gbox2.css_class, is_(False), 'Группа 2 вертикальная', and_wait())

        log('Проверяем, что 3 и 4 группа вертикальные')
        assert_that(lambda: self.vertical_radio in cbg.gbox3.css_class, is_(True), 
                    'Группа 3 горизонтальная', and_wait())
        assert_that(lambda: self.vertical_radio in cbg.gbox4.css_class, is_(True), 
                    'Группа 4 горизонтальная', and_wait())

        log('Тесты 1 группы')
        cbg.box1.click()
        assert_that(lambda: self.control_checked in cbg.box1.css_class, is_(True), 'Чекбокс 1 не выбран', and_wait())
        cbg.box2.click()
        assert_that(lambda: self.control_checked in cbg.box1.css_class, is_(False), 'Чекбокс 1 выбран', and_wait())
        assert_that(lambda: self.control_checked in cbg.box2.css_class, is_(True), 'Чекбокс 2 не выбран', and_wait())

        log('Тесты 2 группы')
        cbg.box3.click()
        assert_that(lambda: self.control_checked in cbg.box3.css_class, is_(True), 'Чекбокс 3 не выбран', and_wait())
        cbg.box4.click()
        assert_that(lambda: self.control_checked in cbg.box3.css_class, is_(True),
                    'Чекбокс 3 не выбран', and_wait())
        assert_that(lambda: self.control_checked in cbg.box4.css_class, is_(True), 'Чекбокс 4 не выбран', and_wait())

        log('Тесты 3 группы')
        cbg.box5.click()
        assert_that(lambda: self.control_checked in cbg.box5.css_class, is_(True), 'Чекбокс 5 не выбран', and_wait())
        cbg.box6.click()
        assert_that(lambda: self.control_checked in cbg.box5.css_class, is_(False), 'Чекбокс 5 выбран', and_wait())
        assert_that(lambda: self.control_checked in cbg.box6.css_class, is_(True), 'Чекбокс 6 не выбран', and_wait())

        log('Тесты 4 группы')
        cbg.box7.click()
        assert_that(lambda: self.control_checked in cbg.box7.css_class, is_(True), 'Чекбокс 7 не выбран', and_wait())
        cbg.box8.click()
        assert_that(lambda: self.control_checked in cbg.box7.css_class, is_(True),
                    'Чекбокс 7 не выбран', and_wait())
        assert_that(lambda: self.control_checked in cbg.box8.css_class, is_(True), 'Чекбокс 8 не выбран', and_wait())

    def test_04_combobox_default(self):
        """ComboBox"""

        self.browser.open(self.config.SITE + '/integration_combobox.html')
        self.browser.maximize_window()
        cbb = ComboBoxNew(self)

        assert_that(lambda: cbb.cbox1, is_displayed(), 'Страница /integration_combobox.htm не открылась', and_wait())
        assert_that(lambda: cbb.cbox1.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('&nbsp;'), 'Текст в выпадающем списке должен быть пустым', and_wait())

        log('Открываем выпадающее меню')
        cbb.cbox1.element('.controls-ComboBox__arrowDown').click()
        assert_that(cbb.picker, is_displayed(), 'Выпадающие меню не открылось', and_wait())
        assert_that(lambda: cbb.picker_clst.count_elements, equal_to(2),
                    'Кол-во элементов в выпадающем меню должно быть 2', and_wait())

        log('Выбираем один элемент')
        cbb.picker_clst.item(contains_text='Пункт1').click()
        assert_that(lambda: cbb.cbox1.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('Пункт1'), 'Текст в выпадающем списке должен быть другим', and_wait())

    def test_05_combobox_placeholder(self):
        """ComboBox with placeholder"""

        self.browser.open(self.config.SITE + '/integration_combobox.html')
        self.browser.maximize_window()
        cbb = ComboBoxNew(self)

        assert_that(lambda: cbb.cbox2, is_displayed(), 'Страница /integration_combobox.html не открылась', and_wait())
        assert_that(lambda: cbb.cbox2.element('.controls-TextBox__fieldWrapper input.controls-TextBox__field')
                    .get_attribute('placeholder'),
                    equal_to('placeholder'), 'Текст в выпадающем списке должен быть пустым', and_wait())

        log('Открываем выпадающее меню')
        cbb.cbox2.element('.controls-ComboBox__arrowDown').click()
        assert_that(cbb.picker, is_displayed(), 'Выпадающие меню не открылось', and_wait())
        assert_that(lambda: cbb.picker_clst.count_elements, equal_to(2),
                    'Кол-во элементов в выпадающем меню должно быть 2', and_wait())

        log('Выбираем один элемент')
        cbb.picker_clst.item(contains_text='Пункт3').click()
        assert_that(lambda: cbb.cbox2.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('Пункт3'), 'Текст в выпадающем списке должен быть другим', and_wait())

    def test_06_combobox_text(self):
        """ComboBox with text"""

        self.browser.open(self.config.SITE + '/integration_combobox.html')
        self.browser.maximize_window()
        cbb = ComboBoxNew(self)

        assert_that(lambda: cbb.cbox3, is_displayed(), 'Страница не открылась', and_wait())
        assert_that(lambda: cbb.cbox3.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('text'), 'Текст в выпадающем списке должен быть пустым', and_wait())

        log('Открываем выпадающее меню')
        cbb.cbox3.element('.controls-ComboBox__arrowDown').click()
        assert_that(cbb.picker, is_displayed(), 'Выпадающие меню не открылось', and_wait())
        assert_that(lambda: cbb.picker_clst.count_elements, equal_to(2),
                    'Кол-во элементов в выпадающем меню должно быть 2', and_wait())

        log('Выбираем один элемент')
        cbb.picker_clst.item(contains_text='Пункт5').click()
        assert_that(lambda: cbb.cbox3.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('Пункт5'), 'Текст в выпадающем списке должен быть другим', and_wait())

    def test_07_combobox_lowercase(self):
        """ComboBox with lowercase transform"""

        self.browser.open(self.config.SITE + '/integration_combobox.html')
        self.browser.maximize_window()
        cbb = ComboBoxNew(self)

        assert_that(lambda: cbb.cbox4, is_displayed(), 'Страница /integration_combobox.html не открылась', and_wait())
        assert_that(lambda: cbb.cbox4.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('&nbsp;'), 'Текст в выпадающем списке должен быть пустым', and_wait())

        log('Открываем выпадающее меню')
        cbb.cbox4.element('.controls-ComboBox__arrowDown').click()
        assert_that(cbb.picker, is_displayed(), 'Выпадающие меню не открылось', and_wait())
        assert_that(lambda: cbb.picker_clst.count_elements, equal_to(2),
                    'Кол-во элементов в выпадающем меню должно быть 2', and_wait())

        log('Выбираем один элемент')
        cbb.picker_clst.item(contains_text='Пункт7').click()
        assert_that(lambda: cbb.cbox4.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('Пункт7'), 'Текст в выпадающем списке должен быть другим', and_wait())

    def test_08_combobox_uppercase(self):
        """ComboBox with uppercase transform"""

        self.browser.open(self.config.SITE + '/integration_combobox.html')
        self.browser.maximize_window()
        cbb = ComboBoxNew(self)

        assert_that(lambda: cbb.cbox5, is_displayed(), 'Страница не открылась', and_wait())
        assert_that(lambda: cbb.cbox5.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('&nbsp;'), 'Текст в выпадающем списке должен быть пустым', and_wait())

        log('Открываем выпадающее меню')
        cbb.cbox5.element('.controls-ComboBox__arrowDown').click()
        assert_that(cbb.picker, is_displayed(), 'Выпадающие меню не открылось', and_wait())
        assert_that(lambda: cbb.picker_clst.count_elements, equal_to(2),
                    'Кол-во элементов в выпадающем меню должно быть 2', and_wait())

        log('Выбираем один элемент')
        cbb.picker_clst.item(contains_text='Пункт9').click()
        assert_that(lambda: cbb.cbox5.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('Пункт9'), 'Текст в выпадающем списке должен быть другим', and_wait())

    def test_09_combobox_not_editable(self):
        """ComboBox not editable"""

        self.browser.open(self.config.SITE + '/integration_combobox.html')
        self.browser.maximize_window()
        cbb = ComboBoxNew(self)

        assert_that(lambda: cbb.cbox6, is_displayed(), 'Страница /integration_combobox.html не открылась', and_wait())
        assert_that(lambda: cbb.cbox6.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('&nbsp;'), 'Текст в выпадающем списке должен быть пустым', and_wait())

        log('Открываем выпадающее меню')
        cbb.cbox6.element('.controls-ComboBox__arrowDown').click()
        assert_that(cbb.picker, is_displayed(), 'Выпадающие меню не открылось', and_wait())
        assert_that(lambda: cbb.picker_clst.count_elements, equal_to(2),
                    'Кол-во элементов в выпадающем меню должно быть 2', and_wait())

        log('Выбираем один элемент')
        cbb.picker_clst.item(contains_text='Пункт11').click()
        assert_that(lambda: cbb.cbox6.element('.controls-TextBox__fieldWrapper .controls-TextBox__field').inner_html,
                    equal_to('Пункт11'), 'Текст в выпадающем списке должен быть другим', and_wait())

    def test_10_switcher(self):
        """Switcher"""

        self.browser.open(self.config.SITE + '/integration_switcher.html')
        self.browser.maximize_window()
        swt = Switcher(self)

        assert_that(swt.switcher1, is_displayed(), 'Страница /integration_switcher.html не загрузилась', and_wait())

        log('Проверяем, что по умолчанию он выключен')
        assert_that(lambda: self.on in swt.switcher1.element('.controls-Switcher__toggle').css_class, is_(False),
                    'Переключатель включен', and_wait())
        assert_that(lambda: self.browser.execute_script("""return $ws.single.ControlStorage.getByName('Switcher 2')
                    .getState();"""), equal_to('off'), 'Переключатель включен', and_wait())
        assert_that(lambda: self.browser.execute_script("""return $ws.single.ControlStorage.getByName('Switcher 2')
                    .getValue();"""), equal_to('off'), 'Переключатель включен', and_wait())

        log('Переключаем переключатель в положение ВКЛ')
        swt.switcher1.click()
        assert_that(lambda: self.on in swt.switcher1.element('.controls-Switcher__toggle').css_class, is_(True),
                    'Переключатель выключен', and_wait())
        assert_that(lambda: self.browser.execute_script("""return $ws.single.ControlStorage.getByName('Switcher 2')
                    .getState();"""), equal_to('on'), 'Переключатель включен', and_wait())
        assert_that(lambda: self.browser.execute_script("""return $ws.single.ControlStorage.getByName('Switcher 2')
                    .getValue();"""), equal_to('on'), 'Переключатель включен', and_wait())

        log('Проверяем переключение через JS методы')
        self.browser.execute_script("""$ws.single.ControlStorage.getByName('Switcher 2').setStateOff("0");""")
        self.browser.execute_script("""$ws.single.ControlStorage.getByName('Switcher 2').setState("off");""")
        assert_that(lambda: swt.switcher1.text, equal_to('0'), '', and_wait())
        assert_that(lambda: self.on in swt.switcher1.element('.controls-Switcher__toggle').css_class, is_(False),
                    'Переключатель включен', and_wait())
        self.browser.execute_script("""$ws.single.ControlStorage.getByName('Switcher 2').setStateOn("1");""")
        self.browser.execute_script("""$ws.single.ControlStorage.getByName('Switcher 2').setState("on");""")
        assert_that(lambda: self.on in swt.switcher1.element('.controls-Switcher__toggle').css_class, is_(True),
                    'Переключатель выключен', and_wait())

        log('Запретим взаимодестовать с переключателем')
        self.browser.execute_script("""$ws.single.ControlStorage.getByName('Switcher 2').setEnabled(false);""")
        swt.switcher1.click()
        assert_that(lambda: self.on in swt.switcher1.element('.controls-Switcher__toggle').css_class, is_(True),
                    'Переключатель выключен', and_wait())


if __name__ == '__main__':
    run_tests()