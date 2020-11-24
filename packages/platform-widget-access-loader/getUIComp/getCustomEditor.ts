import { CustomEditorCtx } from '@engine/visual-editor/spec/custom-editor';
import { getUICompHOC } from './getUIComp';
import * as CustomEditor from '../refs-custom-editor';

/**
 * 获取组件实例
 */
export const getCustomEditor = getUICompHOC<CustomEditorCtx>(CustomEditor);
