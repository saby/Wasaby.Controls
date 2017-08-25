define('js!SBIS3.CONTROLS.Utils.GetTextWidth', function () {

    /**
     * Высчитывает ширину переданного текста в пикселях.
     * Высчитывает по базовым на странице шрифту и размеру, то есть без довеска каких-либо классов.
     * @param text Переданный текст.
     * @returns {Number} Ширина переданного текста в пикселях.
     * @example
     * <pre>
     *     helpers.getTextWidth("helloWorld")
     * </pre>
     */
    return function (text) {
        var hiddenStyle = "left:-10000px;top:-10000px;height:auto;width:auto;position:absolute;";
        var clone = document.createElement('div');

        // устанавливаем стили у клона, дабы он не мозолил глаз.
        // Учитываем, что IE не позволяет напрямую устанавливать значение аттрибута style
        document.all ? clone.style.setAttribute('cssText', hiddenStyle) : clone.setAttribute('style', hiddenStyle);

        clone.innerHTML = text;

        document.body.appendChild(clone);

        //var rect = {width:clone.clientWidth,height:clone.clientHeight,text:clone.innerHTML};
        var rect = clone.clientWidth;
        document.body.removeChild(clone);

        return rect;
    };
});