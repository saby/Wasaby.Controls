# Настройки
## Установка typescript
 npm install -g typescript
 
## Подключение декларции ws

Сделать сим-линк репозитория https://git.sbis.ru/av.zalyaev/typedef в папку /sbis3-controls/typedef

Скомпилировать проект typedef
```
  cd ../typedef
  tsc -p tsconfig.json
```

Подключить в IDE sbis.d.ts как внешнюю библиотеку.

Например в WebStorm:
 + File - Settings - Libraries
 + Добавить библиотеку по проекту
 + Указать в ../typedef/compiles/sbis.d.ts
 