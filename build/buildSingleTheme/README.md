#Скрипт сборки тем оформления

1. Создаем в папке темы less-файл темы, например amazingtheme.less

2. В этом файле настраиваем

@pathBuildSingleTheme: "../SBIS3.CONTROLS/build/buildSingleTheme/";
@import "variables";
@import "@{pathBuildSingleTheme}mixins";
@import "@{pathBuildSingleTheme}general";

3. из SDK вызывается скрпит SBIS3.CONTROLS\build\buildSingleTheme\buildSingleTheme c параметром пути к файлу темы.
`py buildSingleTheme.py D:\amazingtheme\amazingtheme.less`
или
`py buildSingleTheme.py ..\..\..\amazingtheme\amazingtheme.less`

4. результирующий css-файл будет размещен в там же где и less-файл шаблона