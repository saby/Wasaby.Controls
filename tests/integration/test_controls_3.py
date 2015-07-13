# -*- coding: utf-8 -*-
from atf import *
from pages.index import FormattedText
from selenium.webdriver.common.keys import Keys


class TestFormattedText(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование форматного текста"""

    conf = Config()
    disabled = 'ws-disabled'

    def disable_formatted_text(self, browser, number):
        """задизейблить formatted text"""

        locator = 'FormattedTextBox {0}'.format(number)
        return browser.execute_script("$ws.single.ControlStorage.getByName('{0}').setEnabled(false);".format(locator))

    def get_text_from_formatted_text(self, browser, number):
        """получаем текст из форматного контрола"""

        locator = '[name="FormattedTextBox {0}"] .controls-FormattedTextBox__field'.format(number)
        return browser.execute_script("""return $('{0}').text()""".format(locator))

    def setup(self):
        """Данный метод вызывается перед началом каждого тестов"""

        self.browser.open(self.config.SITE + '/regression_formattedtextbox_online.html')
        self.browser.maximize_window()
        ft = FormattedText(self)
        assert_that(ft.phone_inp, is_displayed(),
                    'Страница /regression_formattedtextbox_online.html не открылась', and_wait())

    def test_01_renders(self):
        """01. Тест проверки отображения форматного текста на экране"""

        log('Проверяем страницу на наличие всех элементов')
        ft = FormattedText(self)
        assert_that(ft.date_inp, is_displayed(), 'Элемент не появился на странице', and_wait())
        assert_that(ft.date_long_inp, is_displayed(), 'Элемент не появился на странице', and_wait())
        assert_that(ft.date_month_inp, is_displayed(), 'Элемент не появился на странице', and_wait())
        assert_that(ft.date_month2_inp, is_displayed(), 'Элемент не появился на странице', and_wait())
        assert_that(ft.digit_inp, is_displayed(), 'Элемент не появился на странице', and_wait())
        assert_that(ft.string_inp, is_displayed(), 'Элемент не появился на странице', and_wait())
        assert_that(ft.email_inp, is_displayed(), 'Элемент не появился на странице', and_wait())
        assert_that(ft.time_inp, is_displayed(), 'Элемент не появился на странице', and_wait())

    def test_02_formatted_phone(self):
        """02. Тест проверки форматного текста телефонного номера"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 1), equal_to('+_ (___) ___ - __ - __'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.phone_inp.type_in('ararat', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 1), equal_to('+_ (___) ___ - __ - __'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.phone_inp.type_in('79092785110', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 1), equal_to('+7 (909) 278 - 51 - 10'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 1)
        assert_that(lambda: self.disabled in ft.phone.css_class, is_(True), 
                    'С контролом можно взаимодествовать', and_wait())

    def test_03_formatted_email(self):
        """03. Тест проверки форматного текста адреса электронной почты"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 2), equal_to('__________@_____.com'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.email_inp.type_in('usertensorgmail', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 2), equal_to('usertensor@gmail.com'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.email_inp.type_in('790927851104356', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 2), equal_to('usertensor@gmail.com'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 2)
        assert_that(lambda: self.disabled in ft.email.css_class, is_(True), 
                    'С контролом можно взаимодествовать', and_wait())

    def test_04_formatted_data(self):
        """04. Тест проверки форматного текста даты"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 3), equal_to('__/__/__'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.date_inp.type_in('ararat', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 3), equal_to('__/__/__'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.date_inp.type_in('79092785110', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 3), equal_to('79/09/27'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 3)
        assert_that(lambda: self.disabled in ft.date.css_class, is_(True),
                    'С контролом можно взаимодествовать', and_wait())

    def test_05_formatted_time(self):
        """05. Тест проверки форматного текста времени"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 4), equal_to('__:__:__'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.time_inp.type_in('ararat', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 4), equal_to('__:__:__'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.time_inp.type_in('79092785110', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 4), equal_to('79:09:27'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 4)
        assert_that(lambda: self.disabled in ft.time.css_class, is_(True),
                    'С контролом можно взаимодествовать', and_wait())

    def test_06_formatted_string(self):
        """06. Тест проверки форматного текста строки"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 5), equal_to('____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.string_inp.type_in('ararat', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 5), equal_to('arar'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.string_inp.type_in('79092785110', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 5), equal_to('arar'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 5)
        assert_that(lambda: self.disabled in ft.string.css_class, is_(True),
                    'С контролом можно взаимодествовать', and_wait())

    def test_07_formatted_digit(self):
        """07. Тест проверки форматного текста чисел"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 6), equal_to('______'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.digit_inp.type_in('ararat', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 6), equal_to('______'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.digit_inp.type_in('79092785110', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 6), equal_to('790927'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 6)
        assert_that(lambda: self.disabled in ft.digit.css_class, is_(True),
                    'С контролом можно взаимодествовать', and_wait())

    def test_08_formatted_long_date(self):
        """08. Тест проверки форматного текста длинной даты"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 7), equal_to('__/__/____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.date_long_inp.type_in('ararat', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 7), equal_to('__/__/____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.date_long_inp.type_in('79092785110', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 7), equal_to('79/09/2785'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 7)
        assert_that(lambda: self.disabled in ft.date_long.css_class, is_(True),
                    'С контролом можно взаимодествовать', and_wait())

    def test_09_formatted_month_date(self):
        """09. Тест проверки форматного текста даты с месяцем"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 8), equal_to('__/___/____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.date_month_inp.type_in('ararat', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 8), equal_to('__/___/____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.date_month_inp.type_in('79092785110', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 8), equal_to('79/___/____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести дату')
        ft.date_month_inp.type_in('79' + Keys.ARROW_RIGHT + Keys.ARROW_RIGHT + Keys.ARROW_RIGHT +
                                  Keys.ARROW_RIGHT + '1940', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 8), equal_to('79/___/1940'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести дату')
        ft.date_month_inp.type_in('79' + Keys.ARROW_RIGHT + Keys.ARROW_RIGHT + Keys.ARROW_RIGHT +
                                  Keys.ARROW_RIGHT + '1940', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 8), equal_to('79/___/1940'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 8)
        assert_that(lambda: self.disabled in ft.date_month.css_class, is_(True),
                    'С контролом можно взаимодествовать', and_wait())

    def test_10_formatted_month_date2(self):
        """10. Тест проверки форматного даты с месяцем 2"""

        log('Проверяем текущий текст контрола')
        ft = FormattedText(self)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 9), equal_to('__/___/____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести букву')
        ft.date_month2_inp.type_in('ararat', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 9), equal_to('__/___/____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести цифру')
        ft.date_month2_inp.type_in('79092785110', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 9), equal_to('79/___/____'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести дату')
        ft.date_month2_inp.type_in('79' + Keys.ARROW_RIGHT + Keys.ARROW_RIGHT + Keys.ARROW_RIGHT +
                                   Keys.ARROW_RIGHT + '1940', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 9), equal_to('79/___/1940'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Пытаемся ввести дату')
        ft.date_month2_inp.type_in('79' + Keys.ARROW_RIGHT + Keys.ARROW_RIGHT + Keys.ARROW_RIGHT +
                                   Keys.ARROW_RIGHT + '1940', clear_txt=False)
        assert_that(lambda: self.get_text_from_formatted_text(self.browser, 9), equal_to('79/___/1940'),
                    'Текст не совпадает с эталонным', and_wait())

        log('Запрещаем взаимодествие с контролом')
        self.disable_formatted_text(self.browser, 9)
        assert_that(lambda: self.disabled in ft.date_month2.css_class, is_(True),
                    'С контролом можно взаимодествовать', and_wait())

if __name__ == '__main__':
    run_tests()