import { PlatformCtx } from "@platform-widget-access/spec";
import { ChangeEntityState, WidgetEntityState } from "../data-structure";

/**
 * 自定义编辑器的 ctx
 */
export interface CustomEditorCtx {
  entityState: WidgetEntityState
  changeEntityState: ChangeEntityState
  platformCtx: PlatformCtx
  onSubmit: (nextValue) => void
}

export type CustomEditor = React.ElementType<CustomEditorCtx>
