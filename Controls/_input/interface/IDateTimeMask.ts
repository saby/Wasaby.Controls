import {descriptor} from 'Types/entity';

/**
 * Интерфейс маски ввода даты/времени.
 *
 * @interface Controls/_input/interface/IDateTimeMask
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface for date/time inputs mask.
 *
 * @interface Controls/_input/interface/IDateTimeMask
 * @public
 * @author Красильников А.С.
 */

export default {
    getDefaultOptions: function () {
        return {

            /**
             * @name Controls/_input/interface/IDateTimeMask#mask
             * @cfg {String} Формат даты.
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM'
             * @variant 'YYYY-MM-DD'
             * @variant 'YY-MM-DD'
             * @variant 'HH:mm:ss.UUU'
             * @variant 'HH:mm:ss'
             * @variant 'HH:mm'
             * @variant 'DD.MM.YYYY HH:mm:ss.UUU'
             * @variant 'DD.MM.YYYY HH:mm:ss'
             * @variant 'DD.MM.YYYY HH:mm'
             * @variant 'DD.MM.YY HH:mm:ss.UUU'
             * @variant 'DD.MM.YY HH:mm:ss'
             * @variant 'DD.MM.YY HH:mm'
             * @variant 'DD.MM HH:mm:ss.UUU'
             * @variant 'DD.MM HH:mm:ss'
             * @variant 'DD.MM HH:mm'
             * @variant 'YYYY-MM-DD HH:mm:ss.UUU'
             * @variant 'YYYY-MM-DD HH:mm:ss'
             * @variant 'YYYY-MM-DD HH:mm'
             * @variant 'YY-MM-DD HH:mm:ss.UUU'
             * @variant 'YY-MM-DD HH:mm:ss'
             * @variant 'YY-MM-DD HH:mm'
             * @variant 'YYYY'
             * @variant 'MM.YYYY'
             * @default 'DD.MM.YY'
             * @remark
             * Разрешенные символы маски:
             * <ol>
             *    <li>D — день.</li>
             *    <li>M — месяц.</li>
             *    <li>Y — год.</li>
             *    <li>H — час.</li>
             *    <li>m — минута.</li>
             *    <li>s — секунда.</li>
             *    <li>U — миллисекунда.</li>
             *    <li>".", "-", ":", "/", " " — разделители.</li>
             * </ol>
             * @example
             * В этом примере маска задана таким образом, что в поле ввода можно ввести только время.
             * После ввода пользователем “09:30”, значение _inputValue будет равно 01.01.1904 09:30.000.
             * <pre>
             *    <Controls.input:DateBase bind:value="_inputValue" mask=”HH:mm”/>
             * </pre>
             * <pre>
             *    Control.extend({
             *       _inputValue: null,
             *    });
             * </pre>
             * В следующем примере после ввода пользователем “09:30”, значение _inputValue будет равно 10.03.2018 09:30.000
             * <pre>
             *    <Controls.input:DateBase bind:value="_inputValue" mask=”HH:mm”/>
             * </pre>
             * <pre>
             *    Control.extend({
             *       _inputValue: new Date(2018, 2, 10),
             *    });
             * </pre>
             */

            /*
             * @name Controls/_input/interface/IDateTimeMask#mask
             * @cfg {String} Date format.
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM'
             * @variant 'YYYY-MM-DD'
             * @variant 'YY-MM-DD'
             * @variant 'HH:mm:ss.UUU'
             * @variant 'HH:mm:ss'
             * @variant 'HH:mm'
             * @variant 'DD.MM.YYYY HH:mm:ss.UUU'
             * @variant 'DD.MM.YYYY HH:mm:ss'
             * @variant 'DD.MM.YYYY HH:mm'
             * @variant 'DD.MM.YY HH:mm:ss.UUU'
             * @variant 'DD.MM.YY HH:mm:ss'
             * @variant 'DD.MM.YY HH:mm'
             * @variant 'DD.MM HH:mm:ss.UUU'
             * @variant 'DD.MM HH:mm:ss'
             * @variant 'DD.MM HH:mm'
             * @variant 'YYYY-MM-DD HH:mm:ss.UUU'
             * @variant 'YYYY-MM-DD HH:mm:ss'
             * @variant 'YYYY-MM-DD HH:mm'
             * @variant 'YY-MM-DD HH:mm:ss.UUU'
             * @variant 'YY-MM-DD HH:mm:ss'
             * @variant 'YY-MM-DD HH:mm'
             * @variant 'YYYY'
             * @variant 'MM.YYYY'
             * @default 'DD.MM.YY'
             * @remark
             * Allowed mask chars:
             * <ol>
             *    <li>D — day.</li>
             *    <li>M — month.</li>
             *    <li>Y — year.</li>
             *    <li>H — hour.</li>
             *    <li>m — minute.</li>
             *    <li>s — second.</li>
             *    <li>U — millisecond.</li>
             *    <li>".", "-", ":", "/", " " — delimiters.</li>
             * </ol>
             * @example
             * In this example, the mask is set so that only the time can be entered in the input field.
             * After a user has entered a “09:30”, the value of the _inputValue will be equal 01.01.1904 09:30.000.
             * <pre>
             *    <Controls.input:DateBase bind:value="_inputValue" mask=”HH:mm”/>
             * </pre>
             * <pre>
             *    Control.extend({
             *       _inputValue: null,
             *    });
             * </pre>
             * In the next example after a user has entered a “09:30”, the value of the _inputValue will be equal 10.03.2018 09:30.000
             * <pre>
             *    <Controls.input:DateBase bind:value="_inputValue" mask=”HH:mm”/>
             * </pre>
             * <pre>
             *    Control.extend({
             *       _inputValue: new Date(2018, 2, 10),
             *    });
             * </pre>
             */
            mask: 'DD.MM.YY'
        };
    },

    getOptionTypes: function () {
        return {
            mask: descriptor(String).oneOf([
                'DD.MM.YYYY',
                'DD.MM.YY',
                'DD.MM',
                'YYYY-MM-DD',
                'YY-MM-DD',
                'HH:mm:ss.UUU',
                'HH:mm:ss',
                'HH:mm',
                'DD.MM.YYYY HH:mm:ss.UUU',
                'DD.MM.YYYY HH:mm:ss',
                'DD.MM.YYYY HH:mm',
                'DD.MM.YY HH:mm:ss.UUU',
                'DD.MM.YY HH:mm:ss',
                'DD.MM.YY HH:mm',
                'DD.MM HH:mm:ss.UUU',
                'DD.MM HH:mm:ss',
                'DD.MM HH:mm',
                'YYYY-MM-DD HH:mm:ss.UUU',
                'YYYY-MM-DD HH:mm:ss',
                'YYYY-MM-DD HH:mm',
                'YY-MM-DD HH:mm:ss.UUU',
                'YY-MM-DD HH:mm:ss',
                'YY-MM-DD HH:mm',
                'YYYY',
                'MM.YYYY'
            ])
        };
    }
};
