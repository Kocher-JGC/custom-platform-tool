/**
 * PropEditor
 */
import React from "react";
import produce from "immer";
import union from "lodash/union";
import { Debounce } from "@mini-code/base-func";
import {
  WidgetEntityState,
  PropItemMeta,
  WidgetRelyPropItems,
  EditAttr,
  NextEntityStateType,
  NextEntityState,
  ChangeEntityState,
} from "../../data-structure";
import { GroupPanel, GroupPanelData } from "../GroupPanel";
import { entityStateMergeRule } from "../../utils";

/**
 * 属性项的 map
 */
interface PropItemMetaMap {
  [propID: string]: PropItemMeta;
}

export type PropPanelData = GroupPanelData[];

export type UpdateEntityStateOfEditor = (
  entityState: WidgetEntityState
) => void;
export type InitEntityStateOfEditor = (entityState: WidgetEntityState) => void;

/**
 * 属性项的渲染器标准接口
 */
export interface PropItemRendererProps {
  propItemMeta: PropItemMeta;
  /** 编辑中的所有属性 */
  editingWidgetState: any;
  changeEntityState: ChangeEntityState;
}

export interface PropertiesEditorProps {
  // pageMetadata: PageMetadata
  /** 选中的 entity */
  propItemGroupingData: PropPanelData;
  // selectedEntity: WidgetEntity
  getPropItem: (propItemID: string) => any;
  /** 组件绑定的属性项配置 */
  widgetBindedPropItemsMeta: WidgetRelyPropItems;
  // /** 属性编辑器的配置，通过该配置生成有层级结构的属性编辑面板 */
  // editorConfig?: any
  /** 默认的表单数据state */
  entityState?: WidgetEntityState;
  updateEntityState: (nextState) => void;
  /** 初始化实例 */
  initEntityState: InitEntityStateOfEditor;
  /** 每个属性项的渲染器 */
  propItemRenderer: (props: PropItemRendererProps) => JSX.Element;
}

const debounce = new Debounce();

function makeArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

/**
 * 包装默认值
 */
const wrapDefaultValues = (propItemMeta: PropItemMeta): NextEntityState[] => {
  const { defaultValues, whichAttr } = propItemMeta;
  const _defaultValues = makeArray(whichAttr).map((attr) => ({
    attr,
    value: defaultValues ? defaultValues[attr] : null,
  }));
  return _defaultValues;
};

interface PropertiesEditorState {
  selfEntityState?: WidgetEntityState;
  ready: boolean;
}

/**
 * 属性编辑器面板
 */
class PropertiesEditor extends React.Component<
  PropertiesEditorProps,
  PropertiesEditorState
> {
  state: PropertiesEditorState = {
    ready: false,
    selfEntityState: undefined,
  };

  bindPropItemsMap: PropItemMetaMap | null = null;

  constructor(props) {
    super(props);
    const { entityState } = props;
    if (entityState) {
      this.state.selfEntityState = entityState;
    }
  }

  componentDidMount = async () => {
    // 1. 先等待 this.bindPropItemsMap 赋值完成
    this.setupBindPropItemsMap().then(() => {
      // 2. 设置 entity 的默认 propState
      const { entityState } = this.props;
      let _defaultEntityState = entityState;
      if (!entityState) {
        const { initEntityState } = this.props;

        _defaultEntityState = this.getEntityDefaultState();
        initEntityState(_defaultEntityState);
      }
      this.setState({
        selfEntityState: _defaultEntityState,
        ready: true,
      });
    });
  };

  setupBindPropItemsMap = async () => {
    this.bindPropItemsMap = await this.takeAllPropItemMetaFormWidget();
    this.setState({
      ready: true,
    });
  };

  /**
   * 设置组件实例状态的默认值
   */
  getEntityDefaultState = () => {
    let defaultWidgetState: WidgetEntityState = {};
    const { bindPropItemsMap } = this;

    for (const propID in bindPropItemsMap) {
      const propItemMeta = bindPropItemsMap[propID];

      if (propItemMeta) {
        const _defaultValues = wrapDefaultValues(propItemMeta);
        defaultWidgetState = entityStateMergeRule(
          defaultWidgetState,
          _defaultValues
        );
      }
    }

    return defaultWidgetState;
  };

  /**
   * 更新此组件内部的表单状态
   *
   * TODO: 做更强的状态管理工具
   */
  updateEntityStateForSelf = (nextValue: NextEntityStateType) => {
    this.setState(({ selfEntityState }) => {
      const _nextValue = makeArray(nextValue);
      const nextState = entityStateMergeRule(selfEntityState, _nextValue);
      return {
        selfEntityState: nextState,
      };
    });
  };

  /**
   * 将组件绑定的属性项转换成 PropItemMetaMap
   */
  takeAllPropItemMetaFormWidget = async (): Promise<PropItemMetaMap> => {
    const { widgetBindedPropItemsMeta, getPropItem } = this.props;
    const {
      propItemRefs = [],
      // rawPropItems = []
    } = widgetBindedPropItemsMeta;
    const propItemMetaMap = {};

    /**
     * 将 propItemRefs 转换成 PropItemMeta
     */
    propItemRefs.forEach(async (refItem) => {
      const { propID, editAttr, ...overrideOptions } = refItem;

      // 获取属性项的接口
      const propItemMetaFormInterface = await getPropItem(propID);

      // 合并属性项 meta
      const mergedPropItemMeta = produce(propItemMetaFormInterface, (draft) => {
        if (editAttr) {
          draft.whichAttr = union(makeArray(draft.whichAttr), editAttr);
        }
        Object.assign(draft, overrideOptions);
        return draft;
      });
      propItemMetaMap[propID] = mergedPropItemMeta;
    });
    // rawPropItems.forEach((item) => {
    //   if (item) propItemMetaMap[item.id] = item;
    // });
    return propItemMetaMap;
  };

  takePropItemMeta = (metaID: string) => {
    return this.bindPropItemsMap?.[metaID];
  };

  /**
   * 获取属性项需要的值
   * @param entityState
   * @param propItemMeta
   */
  getPropItemValue = (entityState: WidgetEntityState, editAttr: EditAttr) => {
    const _editAttr = makeArray(editAttr);
    const res = {};
    _editAttr.forEach((attr) => {
      res[attr] = entityState[attr];
    });
    return res;
  };

  changeEntityStateInEditor: ChangeEntityState = (nextValue) => {
    /** 更新自身的数据 */
    this.updateEntityStateForSelf(nextValue);

    /** 延后更新整个应用的数据 */
    debounce.exec(() => {
      const { selfEntityState } = this.state;
      // console.log('selfEntityState :>> ', selfEntityState);
      nextValue && this.props.updateEntityState(selfEntityState);
    }, 100);
  };

  /**
   * prop item 渲染器
   * @param propItemID
   * @param groupType
   */
  propItemRendererSelf = (propItemID, groupType) => {
    // const { selectedEntity } = this.props;
    // const { entityState } = this.props;
    /**
     * 为了确保值的更新是准确的，需要内部维护一次数据
     */
    const { selfEntityState } = this.state;
    const propItemMeta = this.takePropItemMeta(propItemID);

    /** 如果组件没有绑定该属性项，则直接返回 */
    if (!selfEntityState || !propItemMeta) return null;

    const { propItemRenderer } = this.props;

    const editingAttr = propItemMeta.whichAttr;

    /** 将实例状态回填到属性项 */
    const activeState = this.getPropItemValue(selfEntityState, editingAttr);
    return (
      <div key={propItemID}>
        {propItemRenderer({
          propItemMeta,
          changeEntityState: this.changeEntityStateInEditor,
          editingWidgetState: activeState,
        })}
      </div>
    );
  };

  render() {
    const { propItemGroupingData } = this.props;
    const { bindPropItemsMap } = this;

    return bindPropItemsMap ? (
      <div className="entity-prop-editor">
        <GroupPanel
          panelData={propItemGroupingData}
          itemRenderer={this.propItemRendererSelf}
        />
      </div>
    ) : null;
  }
}

export default PropertiesEditor;
