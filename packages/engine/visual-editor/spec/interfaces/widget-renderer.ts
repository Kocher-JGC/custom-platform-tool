import { LayoutWrapperContext } from "@engine/layout-renderer";
import { BusinessWidgetSpec } from "@spec/platform-widget";
import { WidgetEntity, WidgetEntityState } from "../../data-structure";

/**
 * 包装器传给被包装的组件的 props
 */
export interface WidgetRendererProps extends LayoutWrapperContext {
  onClick: React.DOMAttributes<HTMLDivElement>['onClick']
  entity: WidgetEntity
  entityState: WidgetEntityState
  businessWidgetConfig: BusinessWidgetSpec
}
