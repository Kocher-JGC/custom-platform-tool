export interface AdminTmplMenuItem {
  /** 菜单编码 */
  path: string
  /** 菜单显示的名称 */
  title: string
  /** 菜单的 icon */
  icon?: string
  params?: {
    [key: string]: any
  }
  /** 菜单下的子菜单 */
  child?: AdminTmplMenuItem[]
}

export type AdminTmplMenus = AdminTmplMenuItem[]