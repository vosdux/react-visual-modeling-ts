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

## ICONS
В случае проблем с иконками, добавьте в свой файл стилей следующие шрифты

@font-face {font-family: "table-build-icon";
  src: url('//at.alicdn.com/t/font_2369312_0qxuga95yni.eot?t=1613541691358'); /* IE9 */
  src: url('//at.alicdn.com/t/font_2369312_0qxuga95yni.eot?t=1613541691358#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAWYAAsAAAAACwgAAAVJAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDXgqHYIZwATYCJAMcCxAABCAFhU0HdRu9CcgekqRfBAooB8AVIgAgHv6b+7wvM0k+0O4WFKJDxxJRoaoDZCNqRDULu7bEx/9BNjU0TOnmTEyU/l5+nyu9iVB6E1lcy0dQ7yjCtAP5asw+f81h2h6gEhNyRu9qTW0QXSSueyHEbu4ng1QEktWdCkX+6oACqFPlKkx1jbM1Ea9eJrYj80ZpAi1TmUHWBzx9tUayOBBYcKzYw9aok5QXrKERqSbezeIJKDWKu6wLgMfFz8d3NiFKoUzisrYcvVats0/oy4+Q+E84kAhwZX/NMD8iYTEgE7cmW6+AVI0uBrX8v5nt0NLTUKg+5WeNZ91n056TL5/+/w90t8bXQ0+K1/Yvr1IqJKJCwQ6Ue8YqPqGJQPBJNGAYkgBbDmlCoOQzKVDw9WnIuyCv3+lhMhBLAIjXYsNSLyeVJMnydHk1FK3ElFEpRTZ7omrKeZByBq0J/7YCTgLDwMaNo2kbEc/nP08mnveM7yZ5nBwumPCK5jKahiPQkHwuQSeII1cp7hzQIjsxj2GGSR6CtNfmTWVKsXrHJVn9o2CiFTna2rrRLvxlF2U+pzni7Bfy4l1d/d04LtE7OEAlHbdZIEg84lME7XaELkcKjguQIZ0IYS0piMz/neUNpM6Tl2CYktps+Rviezi8WTy+WzGxl8TxbkI+rourUM48SxA8T+Q/jaeftOyDcXPOiqW3bnTeRzXhdoHiSjeG3e9F4NUexJ/EhbS+k3nWdCp++iL7uroATu6KSE+PK0DfvQ2J2wQMqQeq+RaHV+sA9SGFOdbYXq8ROKQRoOZXHEzkbD959gyl5q+m+hpBfKgyb6+WSUmyukNhjvWUjiqZnCScokQVeS4/ZymnLieVU7i0VreWKiwWuuL8ggCVS52hqlY5JTj9/+9MUc6Pqcd09IxfE3CdApCVVlbIwsPC/7cMXI98EpOebSFZe/dCUmJGaQBquXma1x562GonIqC2cMqs3bc7fffuNKbCO+PoDDqt5TQNgxfbViobLt+CiFp1GT34589B+FBcQQ82U10OwokbNybIB+kKnCD+eEe/sg7RNzcdG/c3qefSB+6oLNu9863BW4Acp4VUVFBaokapL6NZiC6bJRKxs3vR799R8u2jKXvhPvjtexVD96Loqd+2o2M6tO7oqA0QP6ggfrctg91tKWAFd+LPcyW7nd/nsx02keXrgJvPdbDO/6Yt8OVXmPo2GwRPg/BtwfTxZ/iau+IqW8dx8aJesbs6tDA8nfZDX9AivS0YYNiTvsN6ETuSpN8LjhXpB2wan0x3U/qf+3dceBn9OVPK7asolsF4zDVX9AxXZMBn/9AQX/wri8wjOfDGqTp7uyeM6aptMRgu0JJX+AN3jrq3v/BE9nzCAN5AoTYHkgEzaVa6QaltA1QGEqFlkcKP28asA0nkJhaaFhCmuwyFnt+QTPdXko2hDqVJ4e6vppSx0LIranNsmxtnW741hDkpyGmG4lxrXPVKPqnLPjCJnPqAlQjv+kFewZhaO3aHfijNAtwI1hZW4xO3ZCg9xgu1Dd5pXZ0LBTVWQ8A+yiNmC1U1NiQnl0V1eby3tCyYapDMrdStiXVSBOWIAnI0QDGHZbhZc26SLEcHjIhicyHAFMFa/oF4CmyeL2Xua2n6D5LKAg89HrBmwWoL6W3QbLXjtSyvVfKcqpPNLkjWpywNBJyLn7TZzAJV0/4Qsx05qWiL4diepTypgBuUxw3rz+UWtMSNqKOIFDnKqKKOhvpcpdWiuGJcXY8mDox3KjqorLI+7zcVI+MkN9uUmIncert6eWi02Xr4bswwPtpWCwAAAA==') format('woff2'),
  url('//at.alicdn.com/t/font_2369312_0qxuga95yni.woff?t=1613541691358') format('woff'),
  url('//at.alicdn.com/t/font_2369312_0qxuga95yni.ttf?t=1613541691358') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('//at.alicdn.com/t/font_2369312_0qxuga95yni.svg?t=1613541691358#table-build-icon') format('svg'); /* iOS 4.1- */
}
@font-face {
  font-family: 'table-build-icon';  /* project id 2369312 */
  src: url('//at.alicdn.com/t/font_2369312_wsg9aeubvfs.eot');
  src: url('//at.alicdn.com/t/font_2369312_wsg9aeubvfs.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_2369312_wsg9aeubvfs.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_2369312_wsg9aeubvfs.woff') format('woff'),
  url('//at.alicdn.com/t/font_2369312_wsg9aeubvfs.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_2369312_wsg9aeubvfs.svg#table-build-icon') format('svg');
}