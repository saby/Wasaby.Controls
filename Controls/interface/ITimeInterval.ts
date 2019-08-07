import {TimeInterval} from 'Types/entity';

/**
 * Интерфейс для поля ввода временного интервала с маской.
 *
 * @interface Controls/interface/ITimeInterval
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface for TimeInterval input mask.
 *
 * @interface Controls/interface/ITimeInterval
 * @public
 * @author Красильников А.С.
 */ 
interface ITimeInterval {
    readonly _options: {
        /**
         * @name Controls/interface/ITimeInterval#mask
         * @cfg {String} Формат ввода временного интервала.
         * @variant 'HH:MM'
         * @variant 'HHH:MM'
         * @variant 'HHHH:MM'
         * @variant 'HH:MM:SS'
         * @variant 'HHH:MM:SS'
         * @variant 'HHHH:MM:SS'
         * @remark
         * Разрешенные символы маски:
         * <ol>
         *    <li>H - часы.</li>
         *    <li>M - минуты.</li>
         *    <li>S - секунды.</li>
         *    <li>":" - разделитель.</li>
         * </ol>
         * Если какая-то часть TimeInterval отсутствует, она будет автоматически дописана.
         * Например, для маски 'HH:mm:ss' - введенное значение '1 : 1: 1' будет преобразовано к значению '01:01:01'.
         */

        /*
         * @name Controls/interface/ITimeInterval#mask
         * @cfg {String} TimeInterval.
         * @variant 'HH:MM'
         * @variant 'HHH:MM'
         * @variant 'HHHH:MM'
         * @variant 'HH:MM:SS'
         * @variant 'HHH:MM:SS'
         * @variant 'HHHH:MM:SS'
         * @remark
         * Allowed mask chars:
         * <ol>
         *    <li>H - hours.</li>
         *    <li>M - minutes.</li>
         *    <li>S - seconds.</li>
         *    <li>":" - delimiters.</li>
         * </ol>
         * If some part of the TimeInterval is missing, they will be autocompleted.
         * For example, for mask 'HH:mm:ss' - input of '1 : 1: 1' will be transformed to '01:01:01' value.
         */         
        mask: 'HH:MM' | 'HHH:MM' | 'HHHH:MM' | 'HH:MM:SS' | 'HHH:MM:SS' | 'HHHH:MM:SS';

        /**
         * @name Controls/interface/ITimeInterval#value
         * @cfg {Object} Значение поля.
         * @remark
         * Значение TimeInterval должно быть установлено с использованием объекта TimeInterval:
         * Например: value = new TimeInterval('P20DT3H1M5S'),  value = new TimeInterval({days: 1, minutes: 5}) и т.д.
         * Подробнее {@link https://wi.sbis.ru/docs/js/Types/entity/TimeInterval/ Types/entity:TimeInterval}.
         * @see Types/entity:TimeInterval
         */

        /*
         * @name Controls/interface/ITimeInterval#value
         * @cfg {Object} TimeInterval.
         * @remark
         * TimeInterval value should be set with TimeInterval object usage:
         * For example: value = new TimeInterval('P20DT3H1M5S'),  value = new TimeInterval({days: 1, minutes: 5}) e t.c.
         * More information in Types/entity:TimeInterval
         * @see Types/entity:TimeInterval
         */         
        value: TimeInterval;
    };
}

export default ITimeInterval;
