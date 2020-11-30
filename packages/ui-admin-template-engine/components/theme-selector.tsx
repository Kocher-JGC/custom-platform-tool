import React, { useState } from 'react';
import store from 'store';

import { $T } from '@deer-ui/core/utils/config';
import { Switch, Grid } from '../ui-refs';

const _themes = ["blue", "light-blue", "cyan", "green", "yellow", "orange", "red", "purple"];
const _layout = ['vertical', 'horizontal'];

const themeDefined = '_THEME_';
const layoutDefined = '_LAYOUT_';
const darkModeDefined = '_DARK_MODE_';

const getThemeConfig = () => {
  const theme = store.get(themeDefined);
  const layout = store.get(layoutDefined);
  const darkMode = store.get(darkModeDefined);

  return {
    theme,
    layout,
    darkMode: darkMode === 'true'
  };
};

const setTheme = (theme) => {
  store.set(themeDefined, theme);
};

const setLayout = (layout) => {
  store.set(layoutDefined, layout);
};

const setDarkMode = (darkMode) => {
  store.set(darkModeDefined, darkMode);
};

export interface ThemeSelectorProps {
  /** 激活的主题 */
  activeTheme?: string
  /** 是否黑夜模式 */
  darkMode?: boolean
  // /** 布局模式 */
  // layout
  /** 响应切换成黑夜模式 */
  onChangeDarkMode?: (isDark: boolean) => void
  /** 响应切换主题 */
  onChangeTheme?: (color: string) => void
  // /** 响应切换布局 */
  // onChangeLayout?
}

export class ThemeSelector extends React.PureComponent<ThemeSelectorProps> {
  state = {
    activeTheme: this.props.activeTheme
  }

  setTheme = (activeTheme) => {
    this.setState({
      activeTheme
    });
  }

  render() {
    const {
      // onChangeLayout,
      // layout,
      darkMode, 
      onChangeDarkMode, 
      onChangeTheme, 
    } = this.props;
    const { activeTheme } = this.state;
    return (
      <div className="theme-changer">
        <p className="control-label">主题选择</p>
        <Grid container alignItems="center" space={10}>
          {
            _themes.map((color) => {
              const isActive = activeTheme === color;
              return (
                <Grid
                  key={color}
                  lg={3}
                  xl={3}
                >
                  <span
                    className={`tile ${isActive ? 'active' : ''} bg_${color} p10`}
                    onClick={(e) => {
                      this.setTheme(color);
                      onChangeTheme?.(color);
                    }}
                  />
                </Grid>
              );
            })
          }
        </Grid>
        <hr />
        <div className="form-group layout a-i-c">
          <span className="control-label mr10">
            {$T('黑夜模式')}
          </span>
          <span className="control-continer">
            <Switch
              hints={['on', 'off']}
              defaultChecked={darkMode}
              onChange={onChangeDarkMode}
            />
          </span>
        </div>
        {/* <div className="form-group layout a-i-c">
          <span className="control-label mr10">
            {$T('宽屏模式')}
          </span>
          <span className="control-continer">
            <Switch
              hints={['on', 'off']}
              defaultChecked={darkMode}
              onChange={onChangeDarkMode}
            />
          </span>
        </div> */}
        {/* <h5>是否横向布局</h5>
          <Switch
            defaultChecked={layout === 'horizontal'}
            onChange={val => onChangeLayout(_layout[!val ? 0 : 1])} /> */}
      </div>
    );
  }
}

export {
  getThemeConfig, setTheme, setLayout, setDarkMode
};
