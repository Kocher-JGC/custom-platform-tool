/**
 * 获取当前用户信息
 */
export async function queryInstallApp() {
  return $A_R(`${process?.env?.NODE_ENV === 'development' ? "http://localhost:5020" : ""}/app-list?t=${new Date().getTime()}`);
}
