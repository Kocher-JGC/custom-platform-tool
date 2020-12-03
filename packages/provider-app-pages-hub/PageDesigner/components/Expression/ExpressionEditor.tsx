import React, { useState, useImperativeHandle, Suspense } from 'react';
import { Spin } from 'antd';
import './expressionEditor.less';

const Editor = React.lazy(() => import(/* webpackChunkName: "code_editor" */'@engine/code-editor'));

export const ExpressionEditor: React.FC<{ defaultValue: string, ref: any }>= React.forwardRef((props, ref) => {
  // const [editingVal, setEditingVal] = useState('');
  const [editor, setEditor] = useState<any>(null);
  const [ready, setReady] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    addFunction, addVariable, generateExpression
  }));

  const delay = async (s: number) => new Promise((resolve) => { setTimeout(resolve, s); });

  /**
   * 插入变量
   * @param var
   */
  const addVariable = async ({ label, value }) => {
    const preCur = editor.getCursor();
    editor.replaceRange(label, preCur, preCur, '+insert');
    const cur = editor.getCursor();
    editor.doc.markText(preCur, cur, { className: "cm-field cm-field-value", attributes: { "data-value": value }, atomic: true });
    editor.focus();
    // const widget = document.createElement("span");
    // widget.className = "cm-field cm-field-value";
    // widget.innerHTML = label;
    // widget.setAttribute("data-value", value);
    // editor.doc.markText(preCur, cur, { atomic: true, replacedWith: widget });
    // editor.focus();
  };

  /**
   * 插入函数
   * @param fun 函数对象
   */
  const addFunction = async ({ name }) => {
    // 1. 插入函数 name，增加函数标记
    const preCur = editor.getCursor();
    editor.replaceRange(name, preCur, preCur, '+insert');
    const cur = editor.getCursor();
    editor.doc.markText(preCur, cur, { className: "cm-keyword", atomic: true });
    // 2. 插入 "(" 和 ")" 分别增加标记
    editor.replaceRange("(", cur, cur, '+insert');
    const cur1 = editor.getCursor();
    editor.doc.markText(cur, cur1, { className: "cm-bracket" });
    editor.replaceRange(")", cur1, cur1, '+insert');
    const cur2 = editor.getCursor();
    editor.doc.markText(cur1, cur2, { className: "cm-bracket" });
    // 3. 定位光标
    await delay(50);
    const cur3 = editor.getCursor();
    editor.setCursor({ line: cur3.line, ch: cur3.ch - 1 });
    editor.focus();
  };

  const generateExpression = () => {
    const expression: string[] = [];
    editor.doc.eachLine((line)=>{
      let lineText = "";
      const sortMarks = line.markedSpans?.sort((a, b) => a.from - b.from);
      sortMarks.forEach((textMark) => {
        if (textMark.marker.className?.indexOf("cm-field") !== -1) {
          lineText += `__${textMark.marker.attributes["data-value"]}__`;
        } else {
          lineText += line.text.substring(textMark.from, textMark.to);
        }
      });
      expression.push(lineText);
    });
    console.log("expression", expression);
    return "test";
  };

  return (

    <Suspense fallback={<span></span>}>
      <Spin tip="初始化编辑器..." spinning={!ready} style={{ backgroundColor:"#fff" }}>
        <div className="expression-editor">
          <Editor
            mode="text/plain"
            renderToolBar={false}
            value={props.defaultValue}
            // ref={editorRef.current}
            // theme="dracula"
            getEditor={(editor) => setEditor(editor)}
            onBeforeChange={(instance, changeObj)=>{
              console.log("改变之前", changeObj);
            }}
            onChange={(instance) => {
              // const value = instance.getValue();
              // setEditingVal(value);
            }}
            ready={()=>{
              setReady(true);
            }}
          />
        </div>
      </Spin>
    </Suspense>

  );
});
