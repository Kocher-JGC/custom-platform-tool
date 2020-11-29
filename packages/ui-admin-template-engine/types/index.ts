export interface AdminTmplMenuItem {
  /** 菜单编码 */
  code: string
  /** 菜单显示的名称 */
  title: string
  /** 菜单的 icon */
  icon?: string
  /** 菜单下的子菜单 */
  child?: AdminTmplMenuItem[]
}

export type AdminTmplMenus = AdminTmplMenuItem[]