import { normalButtonClick, antTableRowClick } from ".";

export const getOnClickHandle = (compTag: string) => {
  switch (compTag) {
    case 'NormalButton':
      return normalButtonClick;
    case 'AndTableRowClick':
      return antTableRowClick;
    default:
      return () => {};
  }
};
