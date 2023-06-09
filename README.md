<h3 align="center">
  Адаптация библиотеки <a href="https://github.com/aliyun/react-visual-modeling/tree/master">react-visual-modeling</a> под react 17.0.2 + typescript
</h3>

<p align="center">
  <img width="100%" src="https://img.alicdn.com/imgextra/i4/O1CN01VZxfyl1pOLc15k7XM_!!6000000005350-1-tps-1665-829.gif">
</p>

## ✨ Feature

- supports React 17.0.2
- supports Typescript

## 📦 Install

```
npm install @vosdux/react-visual-modeling-ts
```

<a href="https://github.com/aliyun/react-visual-modeling/tree/master">Подробнее здесь</a>

<a href="https://github.com/aliyun/react-visual-modeling/tree/master/example">Пример работы здесь</a>

<a href="https://github.com/alibaba/butterfly/tree/master">butterfly core</a>

## `Props`

node - таблица
edge - связь

|Название|Описание|Тип|
|----|----|----|
|data| Данные для отрисовки | any |
|width| Ширина canvas |  `number` \| `string` |
|height| Высота canvas | `number` \| `string` |
|className| className | `string` |
|columns| Описание колонок[columns props](#columns) | Array<[columns](#columns)> |
|nodeMenu| Меню для node |  Array<[menu](#menu-type)> |
|edgeMenu| Меню для edge |  Array<[menu](#menu-type)> |
|actionMenu| Общее меню | `action[]` |
|config| Конфигурация[config props](#config) | any |
|emptyContent| Контент для пустой таблицы  |  `string` \| `JSX. Element`|
|emptyWidth| Ширина пустой таблицы | `number` \| `string`|
|beforeDeleteNode| Колбек удаления node |`???` |
|beforeDeleteEdge| Колбек удаления edge  |`???` |
|onLoaded| Событие загрузки  |`(canvas) => void` |
|onChange| Событие изменения (например добавление связи)|`(data) => void`|
|onFocusNode| Событие фокусировки на node |`(node) => void`|
|onFocusEdge| Событие фокусировки на edge |`(edge) => void`|
|onFocusCanvas| Событие фокусировки на canvas | `() => void`|
|onDblClickNode| Событие двойного клика на node |`(node) => void`|
|onDblClickEdge| Событие двойного клика на edge |`(node) => void`|
|selectable| ??? | `boolean` |
|onSelect| ??? | `(nodes, edges) => void` |

<br />

### <a name='columns'></a><b>columns</b>

|Название|Описание|Тип|
|---|---|---|
|title| Наименование | `string` |
|key| Ключ | `string` |
|width| Ширина | `number` |
|primaryKey| Первичный ключ | `boolean` |
|render| Рендер метод |`(key) => void`|

<br />

### <a name='menu-type'></a><b>menu</b>

|Название|Описание|Тип|
|---|---|---|
|title  | Наименование | `string` |
|key    | Ключ         | `string` |
|render | Рендер метод | `(key) => void` |
|onClick| Клик         | `(key, data) => void` |

<br>

### <a name='config'></a><b>config</b>

|Название|Описание|Тип|
|---|---|---|
| disableDeleting     | Отключить возможность удаления node            | `boolean` |
| disableCollapse     | Отключить возможность сворачивания node        | `boolean` |
| disableEdgeCreation | Отключить возможность создавать связи в ручную | `boolean` |
| showActionIcon      | Показать главное меню          | `boolean` |
| allowKeyboard       | Разрешить события с клавиатуры | `boolean` |
| titleRender         | Рендер наменования node        | `(title) => JSX.Element` |
| titleExtIconRender  | Рендер иконки в шапке node     | `(node) => JSX.Element` |
| labelRender         | Рендер лейбла edge             | `(label) => JSX.Element` |
| minimap             | Настройки миникарты            |  [minimap prop](#minimap-prop) { }|
| autoLayout          | Автоматическое позициониование |  [layout prop](#layout-prop) { }|
| gridMode            | Настройки холста               |  [grid prop](#grid-prop) { }|

<br>

### <a name='grid-prop'></a><b>grid prop</b>

|Название|Описание|Тип|
|---|---|---|
| isAdsorb | ???             | `boolean` |
| theme    | Настройки темы  | [theme prop](#theme-prop) { } |

<br>

### <a name='theme-prop'></a><b>grid theme</b>

|Название|Описание|Тип|
|---|---|---|
| shapeType   | Круги или линии | `string` |
| gap         | Отступы         | `number` |
| lineWidth   | Ширина линии    | `boolean`|
| lineColor   | Цвет линии      | `string` |
| circleRadiu | Радиус круга    | `number` |
| circleColor | Цвет круга      | `string` |

<br>

### <a name='layout-prop'></a><b>layout prop</b>

|Название|Описание|Тип|
|---|---|---|
| type | https://github.com/alibaba/butterfly/blob/master/docs/en-US/layout.md | `string` |
| options | https://github.com/alibaba/butterfly/blob/master/docs/en-US/layout.md | `any` |

<br>

### <a name='minimap-prop'></a><b>minimap</b>

|Название|Описание|Тип|
|---|---|---|
| enable | Включить миникарту | `boolean` |
| config | Кофигурация       | [minimap props](#minimap-config-prop) |

<br>

### <a name='minimap-config-prop'></a><b>minimap-config-prop</b>

|Название|Описание|Тип|
|---|---|---|
|nodeColor      |Цвет ноды                     |`string`|
|activeNodeColor|Цвет активной ноды                  |`string`|
|viewportStyle  |css стили - не CssProperties|`Record<string, string>`|

<br>


## Usage

``` JSX
import TableBuilding from "@vosdux/react-visual-modeling-ts";
import "@vosdux/react-visual-modeling-ts/dist/esm/index.css";

export const columns = [
  {
    key: "id",
    primaryKey: true,
  },
];

export const data = {
  nodes: [
    {
      id: "aaa",
      title: "aaa",
      top: 200,
      left: 200,
      fields: [
        {
          id: "field_1",
        },
      ],
    },
    {
      id: "bbb",
      title: "bbb",
      top: 400,
      left: 400,
      fields: [
        {
          id: "field_1",
        },
      ],
    },
  ],
  edges: [
    {
      id: 1,
      sourceNode: "aaa",
      targetNode: "bbb",
      source: "field_1",
      target: "field_1",
    },
  ],
};

<TableBuilding
  columns={columns}
  data={data}
/>
```