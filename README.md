# cassements-calculator
Калькулятор оконных конструкций

## Клиент
- [Клиентская часть, демо](http://sdcollection.com/tests/cassements-calculator)
- Форма подготовленных данных в [data-example.deployed.json](data-example.deployed.json)

## Сервер
### Modx (ветка [modx](https://github.com/MrSwed/cassements-calculator/tree/modx))
- Версия разработки 1.0.15 (Oct 31, 2014)
- ManagerManager 0.6.2 (2014-05-28) 
- [mm_ddMultipleFields MOD](https://github.com/MrSwed/MODXEvo.plugin.ManagerManager.mm_ddMultipleFields) с расширенными параметрами ([Обзор на modx.im](http://modx.im/blog/addons/4265.html))
- Плагин [LoadElement](https://gist.github.com/MrSwed/4e5e7f51bc5adb58b3a94f52bafe2fa5), соответственно чанки и сниппеты находятся в [assets/elements](https://github.com/MrSwed/cassements-calculator/blob/modx/assets/element/)
- [Правила для дерева ресурсов (**нужно указать ключевые**)](https://github.com/MrSwed/cassements-calculator/blob/modx/assets/element/chunk/mm_rules_calculator.tpl)

#### Структура ресурсов

 - Calculator
   - Типы конструкций
      - Элементы
        - Элемент, параметры, картинки...
      - Элементы
        - Элемент, параметры, картинки...
      - Конструкции (из указанных елементов)</code>
         - Конструкция, параметры элементов, картинки готовых конструкций

