import * as React from "react";
import * as ReactDOM from "react-dom";

import $ from "jquery";
import * as _ from "lodash";

import { bfCfg } from "./config";
import { Arrow } from "butterfly-dag";
import Canvas from "./canvas/canvas";
import EdgeRender from "./component/edge-render";
import ActionMenu, { action } from "./component/action-menu";
import { transformInitData, diffPropsData } from "./adaptor";

import "butterfly-dag/dist/index.css";

import "./index.less";

// Состав колонок таблицы
interface columns {
  title?: string;
  key: string;
  width?: number;
  primaryKey: boolean;
  render?(value: any, rowData: any): void;
}

interface config {
  showActionIcon?: boolean; // Показывать ли меню (Больше, меньше, фокусировка)
  allowKeyboard?: boolean; // Разрешить события с клавиатуры
  collapse: {
    enable: boolean; // Выключение collapse (не работает)
    defaultMode: string; // Отображение collapse по умолчанию (expand || collapse)
    status: boolean; // ???
    showCollapseDetail: boolean; // ???
  };
  disableDeleting?: boolean; // Отключить возможность удаления таблиц
  disableCollapse?: boolean; // Отключить возможность сворачивания таблиц
  disableEdgeCreation?: boolean; // Отключить возможность создавать связи в ручную
  enableHoverChain?: boolean;
  enableFoucsChain?: boolean;
  titleRender?(title: JSX.Element): void; // Рендер заголовков таблиц
  titleExtIconRender?(node: JSX.Element): void; // Добавить иконку в шапку таблицы
  labelRender?(label: JSX.Element): void; // Рендер лейблов связи
  autoLayout?: {
    type: string; // Тип алгоритма https://github.com/alibaba/butterfly/blob/master/docs/en-US/layout.md
    options: any; // Настройки алгоритма https://github.com/alibaba/butterfly/blob/master/docs/en-US/layout.md
  };
  minimap?: {
    // Настройки минимапы
    enable: boolean; // Включить минимапу
    config: {
      nodeColor: string; // Цвет ноды
      activeNodeColor: string; // Цвет активной ноды
      viewportStyle: Record<string, string>; // Стили минимапы
    };
  };
  gridMode?: {
    // Настройки холста
    isAdsorb: boolean;
    theme: {
      shapeType: string; // Круги или линии
      gap: number; // Отступы
      lineWidth: number; // Ширина линии
      lineColor: string; // Цвет линии
      circleRadiu: number; // Радиус круга
      circleColor: string; // Цвет круга
    };
  };
  butterfly?: any;                                // Конфигурация холста：https://github.com/alibaba/butterfly/blob/dev/v4/docs/zh-CN/canvas.md
}

// Менюшки
interface menu {
  title?: string;
  key: string;
  render?(key: string): void;
  onClick?(node: any): void;
}

interface ComProps {
  width?: number | string; // Ширина canvas
  height?: number | string; // Высота canvas
  className?: string; // classname
  columns: columns[]; // Описание колонок таблиц
  nodeMenu?: menu[]; // Меню для node
  edgeMenu?: menu[]; // Меню для edge
  actionMenu?: action[]; // Общее меню
  config?: Partial<config>; // Конфигурация
  data: any; // Данные для отрисовки
  emptyWidth?: number | string; // Ширина пустой таблицы
  emptyContent?: string | JSX.Element; // Контент для пустой таблицы
  selectable?: boolean; // ???
  beforeDeleteNode?: Promise<any> | boolean; // Колбек удаления node
  beforeDeleteEdge?: Promise<any> | boolean; // Колбек удаления edge
  onLoaded?(canvas: any, utils?: any): void; // Событие загрузки
  onChange?(data: any): void; // Событие изменения (например добавление связи)
  onFocusNode?(node: any): void; // Событие фокусировки на node
  onFocusEdge?(edge: any): void; // Событие фокусировки на edge
  onFocusCanvas?(): void; // Событие фокусировки на canvas
  onDblClickNode?(node: any): void; // Событие двойного клика на node
  onDblClickEdge?(edge: any): void; // Событие двойнокго клика на связь
  onSelect?(nodes: any, edges: any): void; // ???
  beforeLoad?: any;
}

const noop = () => null;

export default class TableBuilding extends React.Component<ComProps, any> {
  protected canvas: any;
  protected canvasData: any;
  private _focusNodes: any;
  private _columns: any;
  private _focusLinks: any;
  private _enableHoverChain: any;
  private _enableFocusChain: any;
  private root: any;
  props: ComProps;

  constructor(props: ComProps) {
    super(props);
    this.canvas = null;
    this.canvasData = null;
    this.root = null;

    this._focusNodes = [];
    this._focusLinks = [];

    this._enableHoverChain = _.get(props, "config.enableHoverChain", true);
    this._enableFocusChain = _.get(props, "config.enableFocusChain", false);
  }

  componentDidMount() {
    const { beforeLoad = noop, config = {} as config } = this.props;

    let root = ReactDOM.findDOMNode(this) as HTMLElement;
    this.root = root;

    if (this.props.width !== undefined) {
      root.style.width = (this.props.width || 500) + "px";
    }

    if (this.props.height !== undefined) {
      root.style.height = (this.props.height || 500) + "px";
    }

    let result = transformInitData({
      columns: this.props.columns,
      config: this.props.config,
      nodeMenu: this.props.nodeMenu,
      edgeMenu: this.props.edgeMenu,
      data: _.cloneDeep(this.props.data),
      emptyContent: this.props.emptyContent,
      emptyWidth: this.props.emptyWidth,
    });

    this.canvasData = result;
    this.canvas = new Canvas(
      _.merge(
        {},
        // 默认配置
        bfCfg,
        // 用户配置
        (config.butterfly || {}),
        // 固定配置
        {
          root,
          data: {
            enableHoverChain: this._enableHoverChain,
            enableFocusChain: this._enableFocusChain,
            showCollapseDetail: _.get(
              this.props,
              "config.collapse.showCollapseDetail",
              false
            ),
          },
          layout: _.get(this.props, "config.autoLayout", undefined),
        }
      )
    );

    beforeLoad({
      canvas: this.canvas,
      Arrow,
    });

    this.canvas.draw(result, () => {
      this.props.onLoaded && this.props.onLoaded(this.canvas);
      let minimap = _.get(this, "props.config.minimap", {});

      if (_.get(this, "props.config.allowKeyboard")) {
        $(root).attr("tabindex", 0).focus();
        root.addEventListener("keydown", this._deleteFocusItem.bind(this));
      }

      //@ts-ignore
      const minimapCfg = _.assign({}, minimap.config, {
        events: ["system.node.click", "system.canvas.click"],
      });

      //@ts-ignore
      if (minimap && minimap.enable) {
        this.canvas.setMinimap(true, minimapCfg);
      }

      if (_.get(this, "props.config.collapse.defaultMode") === "collapse") {
        this.canvas.nodes.forEach((item) => {
          this.canvas.collapse(item.id);
        });
      }

      if (_.get(this, "props.config.gridMode")) {
        this.canvas.setGridMode(
          true,
          _.assign({}, _.get(this, "props.config.gridMode", {}))
        );
      }

      this.forceUpdate();
    });

    this.initEvents();
  }

  /**
   * 初始化butterfly事件
   */
  initEvents() {
    const { config, edgeMenu } = this.props;
    let isAfterSelect = false;

    let _addLinks = (links: any) => {
      let newLinkOpts = links.map((item: any) => {
        let _oldSource = _.get(item, "sourceEndpoint.id", "").replace(
          "-right",
          ""
        );
        let _oldTarget = _.get(item, "targetEndpoint.id", "").replace(
          "-left",
          ""
        );
        let _newSource = _oldSource + "-right";
        let _newTarget = _oldTarget + "-left";
        return {
          id:
            item.options.id ||
            `${item.options.sourceNode}-${_oldSource}-${item.options.targetNode}-${_oldTarget}`,
          sourceNode: item.options.sourceNode,
          targetNode: item.options.targetNode,
          arrowShapeType: item.arrowShapeType,
          source: _newSource,
          target: _newTarget,
          _menu: item.options._menu || edgeMenu,
          _config: item.options._config || config,
          type: "endpoint",
          label: item.label,
        };
      });

      this.canvas.removeEdges(links, true);
      let newEdge = this.canvas.addEdges(newLinkOpts, true);
      newEdge.forEach((item) => {
        this.canvas.originEdges.push(
          _.assign({}, item.options, {
            source: _.get(item, "sourceEndpoint.options.originId"),
            target: _.get(item, "targetEndpoint.options.originId"),
          })
        );
      });

      return newEdge;
    };

    this.canvas.on("system.link.connect", (data: any) => {
      let newEdges = _addLinks(data.links || []);
      this.onConnectEdges(newEdges);
      this.forceUpdate();
    });

    this.canvas.on("system.link.reconnect", (data: any) => {
      let _addEdges = _addLinks(data.addLinks || []);
      this.onReConnectEdges(_addEdges, data.delLinks);

      this.forceUpdate();
    });

    this.canvas.on("custom.edge.dblClick", (data: any) => {
      this.props.onDblClickEdge && this.props.onDblClickEdge(data.edge);
    });

    this.canvas.on("system.node.click", (data: any) => {
      $(this.root).attr("tabindex", 0).focus();
      this._focusNode(data.node);
    });

    this.canvas.on("system.node.dblClick", (data: any) => {
      this.props.onDblClickNode && this.props.onDblClickNode(data.node);
    });

    this.canvas.on("system.link.click", (data: any) => {
      $(this.root).attr("tabindex", 0).focus();
      this._focusLink(data.edge);
    });

    this.canvas.on("system.canvas.click", (data: any) => {
      $(this.root).attr("tabindex", 0).focus();
      if (isAfterSelect) {
        return;
      }
      this._unfocus();
      this.props.onFocusCanvas && this.props.onFocusCanvas();
      this.canvas.unfocus();
    });

    this.canvas.on("system.multiple.select", ({ data }) => {
      $(this.root).attr("tabindex", 0).focus();

      // 加这个判断是为了防止[system.canvas.click]事件和当前事件冲突
      isAfterSelect = true;

      const { nodes, edges } = data;
      this._unfocus();

      nodes.forEach((node) => {
        node.focus();
        this._focusNodes.push(node);
      });

      edges.forEach((edge) => {
        edge.focus();
        this._focusLinks.push(edge);
      });

      _.isFunction(this.props.onSelect) && this.props.onSelect(nodes, edges);

      // 防止误触
      setTimeout(() => {
        isAfterSelect = false;
      }, 100);
    });

    this.canvas.on("custom.node.delete", (data: any) => {
      this.onDeleteNodes([data.node]);
    });

    this.canvas.on("custom.item.focus", (data: any) => {
      this._unfocus();
      this._focusNodes = this._focusNodes.concat(data.nodes || []);
      this._focusLinks = this._focusLinks.concat(data.edges || []);
    });

    this.canvas.on("table.canvas.expand", () => {
      this.forceUpdate();
    });

    this.canvas.on("table.canvas.collapse", () => {
      this.forceUpdate();
    });
  }

  shouldComponentUpdate(newProps: ComProps, newState: any) {
    if (this.canvas.isSelectMode !== !!newProps.selectable) {
      this.canvas.setSelectMode(!!newProps.selectable);
    }

    // 更新节点
    let result = transformInitData({
      columns: this.props.columns,
      config: this.props.config,
      nodeMenu: this.props.nodeMenu,
      edgeMenu: this.props.edgeMenu,
      data: _.cloneDeep(newProps.data),
      emptyContent: this.props.emptyContent,
      emptyWidth: this.props.emptyWidth,
    });

    let diffInfo = diffPropsData(result, this.canvasData, {
      oldCol: this.props.columns,
      newCol: newProps.columns,
    });
    if (diffInfo.addNodes.length > 0) {
      this.canvas.addNodes(diffInfo.addNodes);
    }
    if (diffInfo.rmNodes.length > 0) {
      this.canvas.removeNodes(diffInfo.rmNodes.map((item) => item.id));
    }

    // 更新节点中的字段
    let _isDiffNode =
      diffInfo.updateTitle.length > 0 ||
      diffInfo.updateFields.length > 0 ||
      diffInfo.addFields.length > 0 ||
      diffInfo.rmFields.length > 0 ||
      diffInfo.newCol.length > 0;

    if (_isDiffNode) {
      this.canvas.updateNodes(diffInfo);
    }

    if (diffInfo.addEdges.length > 0) {
      this.canvas.addEdges(diffInfo.addEdges);
    }

    if (diffInfo.rmEdges.length > 0) {
      this.canvas.removeEdges(diffInfo.rmEdges.map((edge) => edge.id));
    }

    if (diffInfo.updateLabel.length > 0) {
      this.canvas.updateLabel(diffInfo.updateLabel);
    }

    let newCollapse = _.get(newProps, "config.collapse.status", false);
    let oldCollapse = _.get(this.props, "config.collapse.status", false);

    if (newCollapse !== oldCollapse) {
      this.canvas.nodes.forEach((node) => {
        newCollapse && this.canvas.collapse(node.id);
        !newCollapse && this.canvas.expand(node.id);
      });
    }

    this.canvasData = result;
    return true;
  }

  componentWillUnmount() {
    if (_.get(this, "props.config.allowKeyboard")) {
      this.root.removeEventListener("keydown", this._deleteFocusItem);
    }
  }

  onConnectEdges(links) {
    let linksInfo = links.map((item) => {
      return _.assign(item.options, {
        source: _.get(item, "options.source", "").replace("-right", ""),
        target: _.get(item, "options.target", "").replace("-left", ""),
        _sourceNode: item.sourceNode,
        _targetNode: item.targetNode,
        _sourceEndpoint: item.sourceEndpoint,
        _targetEndpoint: item.targetEndpoint,
      });
    });

    let newEdges = _.differenceWith(
      linksInfo,
      this.canvasData.edges,
      (a: any, b: any) => {
        return (
          a.sourceNode === b.sourceNode &&
          a.targetNode === b.targetNode &&
          a.source === b.source &&
          a.target === b.target
        );
      }
    );

    this.canvasData.edges = this.canvasData.edges.concat(newEdges);

    this.props.onChange &&
      this.props.onChange({
        type: "system.link.connect",
        links: linksInfo,
      });
  }

  onReConnectEdges(addLinks, rmLinks) {
    let addLinksInfo = addLinks.map((item) => {
      return _.assign(item.options, {
        source: _.get(item, "options.source", "").replace("-right", ""),
        target: _.get(item, "options.target", "").replace("-left", ""),
      });
    });
    let rmLinksInfo = rmLinks.map((item) => {
      return _.assign(item.options, {
        source: _.get(item, "options.source", "").replace("-right", ""),
        target: _.get(item, "options.target", "").replace("-left", ""),
      });
    });
    this.props.onChange &&
      this.props.onChange({
        type: "system.link.reconnect",
        addLinks: addLinksInfo,
        rmLinks: rmLinksInfo,
      });
  }

  onDeleteNodes(nodes) {
    let beforeDeleteNode =
      this.props.beforeDeleteNode ||
      function () {
        return true;
      };
    //@ts-ignore
    Promise.resolve(beforeDeleteNode(nodes))
      .then((result) => {
        if (result === false) {
          return false;
        } else {
          let neighborLinksInfo = [];
          nodes.forEach((node) => {
            let links = this.canvas.getNeighborEdges(node.id);
            let linksInfo = links.map((link) => {
              return link.options;
            });
            neighborLinksInfo = neighborLinksInfo.concat(linksInfo);

            node.remove();
          });

          let nodesInfo = nodes.map((item) => {
            return item.options;
          });

          this.props.onChange &&
            this.props.onChange({
              type: "system.node.delete",
              nodes: nodesInfo,
              neighborLinks: neighborLinksInfo,
            });
        }
      })
      .catch(() => {});
  }

  onDeleteEdges(links) {
    let beforeDeleteEdge =
      this.props.beforeDeleteEdge ||
      function () {
        return true;
      };
    //@ts-ignore
    Promise.resolve(beforeDeleteEdge(links))
      .then((result) => {
        if (result === false) {
          return;
        } else {
          let linksInfo = links.map((item) => {
            return item.options;
          });

          this.props.onChange &&
            this.props.onChange({
              type: "system.link.delete",
              links: linksInfo,
            });
        }
      })
      .catch(() => {});
  }

  _genClassName() {
    return (this.props.className || "") + " butterfly-table-building";
  }

  // 聚焦节点
  _focusNode(node) {
    this._unfocus();
    node.focus();
    this._focusNodes.push(node);
    this.props.onFocusNode && this.props.onFocusNode(node);
  }

  // 聚焦线段
  _focusLink(edge) {
    this._unfocus();
    edge.focus();
    this._focusLinks.push(edge);
    this.props.onFocusEdge && this.props.onFocusEdge(edge);
  }

  // 失焦
  _unfocus() {
    this._focusNodes.forEach((item) => {
      item.unfocus();
    });

    this._focusLinks.forEach((item) => {
      item.unfocus();
    });

    this._focusNodes = [];
    this._focusLinks = [];
  }

  _deleteFocusItem(e) {
    // todo: 这块需要好好思考下
    if (e.key === "Delete" || e.key === "Backspace") {
      if (this._focusNodes && this._focusNodes.length > 0) {
        this.onDeleteNodes(this._focusNodes);
      }
      if (this._focusLinks && this._focusLinks.length > 0) {
        this.onDeleteEdges(this._focusLinks);
      }
    }
  }

  _delNodes(nodes) {
    return nodes.map((item) => {
      return item.options;
    });
  }

  _delEdges(edges) {
    return edges.map((item) => {
      return item.options;
    });
  }

  render() {
    const { canvas } = this;
    const { actionMenu = [] } = this.props;
    const actionMenuVisible = _.get(this, "props.config.showActionIcon", true);
    const labelRender = _.get(this, "props.config.labelRender", noop);
    const selectable = !!this.props.selectable;

    return (
      <div
        className={this._genClassName()}
        style={{
          cursor: selectable ? "crosshair" : "default",
        }}
      >
        <ActionMenu
          canvas={canvas}
          actionMenu={actionMenu}
          visible={actionMenuVisible}
        />
        <EdgeRender
          canvas={canvas}
          //@ts-ignore
          labelRender={labelRender}
        />
      </div>
    );
  }
}
