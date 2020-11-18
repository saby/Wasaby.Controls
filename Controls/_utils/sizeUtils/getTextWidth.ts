/**
 * Модуль, в котором реализована функция <b>getTextWidth(parent, child)</b>.
 * Высчитывает ширину переданного текста в пикселях.
 * Высчитывает по базовым на странице шрифту и размеру, то есть без довеска каких-либо классов.
 *
 * @remark
 * <h2>Параметры функции</h2>
 * * {String} text Переданный текст
 * * {Number} fontSize Размер шрифта переданного текста
 * * {Boolean} isPureText Определяет, содержит ли переданный текст верстку
 *
 * <h2>Возвращает</h2>
 * * {Number} Ширина переданного текста в пикселях.
 *
 * @example
 * <pre class="brush: js">
 *     import {getTextWidth} from 'Controls/sizeUtils';
 *      getTextWidth("helloWorld", 18);
 * </pre>
 *
 * @class Controls/_utils/sizeUtils/getTextWidth
 * @public
 * @author Красильников А.С.
 */

export function getTextWidth(text: string, fontSize?: number, isPureText?: boolean): number {
    const hiddenStyle = 'left:-10000px;top:-10000px;height:auto;width:auto;position:absolute;' + (fontSize ? ('font-size: ' + fontSize + 'px;') : '');
    const clone: HTMLDivElement = document.createElement('div');

    // устанавливаем стили у клона, дабы он не мозолил глаз.
    // Учитываем, что IE не позволяет напрямую устанавливать значение аттрибута style
    document.all ? clone.style.setAttribute('cssText', hiddenStyle) : clone.setAttribute('style', hiddenStyle);

    if (isPureText) {
        clone.innerText = text;
    } else {
        clone.innerHTML = text;
    }

    document.body.appendChild(clone);

    // var rect = {width:clone.clientWidth,height:clone.clientHeight,text:clone.innerHTML};
    const rect = clone.clientWidth;
    document.body.removeChild(clone);

    return rect;
}
