import React, { useEffect, useState } from 'react';
// import * as AllIconsBI from "react-icons/bi";
// import * as AllIconsRI from "react-icons/ri";
import { Tabs, notification } from 'antd';
import { ModalFooter } from '@provider-app/table-editor/components/ChooseDict';
import { useIcon } from '@infra/utils/useIcon';
import { LoadingTip } from '@provider-ui/loading-tip';
import { MESSAGE } from '../constants';

const { TabPane } = Tabs;
interface IIconAppointed {
  iconType: string
}

/** 展示 iconType 指定的 icon */
export const IconAppointed: React.FC<IIconAppointed> = ({
  iconType
}) => {
  const [ready, icons] = useIcon('react-icons/all');
  if (!ready || !icons) return null;
  const Icon = icons[iconType];
  return Icon ? (
    <Icon/>
  ) : null;
};
const filterIconByArea = {
  AllIconsBI: () => {
    return AllIconsBI;
  },
  AllIconsRI: () => {
    const ri = {};
    /** UI 要求不要面性图标 */
    for (const key in AllIconsRI) {
      if (!/Fill$/.test(key)) {
        ri[key] = AllIconsRI[key];
      }
    }
    return ri;
  }
};
/** 获取用于展示的 icon 列表 */
const getIconList = (listAreaKey) => {
  const listArea = filterIconByArea[listAreaKey]();
  const IconItems = Object.keys(listArea).map((key) => {
    return { type: key, icon: listArea[key] };
  });
  console.log('IconItems :>> ', IconItems);
  return IconItems;
};
/** 选择 icon  */
interface ISelectPage {
  currentIcon: string
  onOk: (param: string) => void
  onCancel: () => void
}

const iconSelectionList = [
  { key: 'react-icons/ri', tabName: '电脑图标' },
  { key: 'react-icons/bi', tabName: '手机图标' }
];

const iconListCache = {};

const genIconList = (iconMap, cacheKey) => {
  const res = iconListCache[cacheKey] || [];
  if (res.length > 0) return res;
  Object.keys(iconMap).forEach((iconKey) => {
    res.push({
      type: iconKey,
      Icon: iconMap[iconKey]
    });
  });
  return res;
};

const ShowIconList = ({
  iconType,
  iconSelected,
  setIconSelected
}) => {
  const [ready, iconMap] = useIcon(iconType);
  const [list, setList] = useState([]);
  useEffect(() => {
    if (!ready) return;
    setTimeout(() => {
      const iconList = genIconList(iconMap, iconType);
      setList(iconList);
    }, 1100);
  }, [ready]);
  // if (!ready) return <LoadingTip />;
  if (!ready || !list) return <LoadingTip />;
  // const iconList = genIconList(iconMap, iconType);

  // TODO: 使用虚拟列表优化性能
  return (
    <>
      {
        list.map(({ type, Icon }) => {
          return (
            <div
              className={
                iconSelected === type
                  ? 'float-left text-xl p-2 m-1 bg-blue-500 text-white cursor-pointer'
                  : 'float-left text-xl p-2 m-1 cursor-pointer'
              }
              key = {type}
              onClick={() => {
                setIconSelected(type);
              }}
            >
              <Icon />
            </div>
          );
        })
      }
    </>
  );
};

export const SelectIcon: React.FC<ISelectPage> = (props: ISelectPage) => {
  const {
    currentIcon, onOk, onCancel
  } = props;
  const [iconSelected, setIconSelected] = useState<string>('');
  useEffect(() => {
    setIconSelected(currentIcon);
  }, [currentIcon]);
  /** 点击保存 */
  const handleOk = () => {
    /** 强制选择图标 */
    if (!iconSelected) {
      notification.warn({
        message: MESSAGE.SELECT_ICON_FAILED,
      });
      return;
    }
    onOk && onOk(iconSelected);
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  return (
    <>
      <Tabs defaultActiveKey="1" style={{ marginTop: -15 }}>
        {
          iconSelectionList.map((item, index) => {
            return (
              <TabPane tab={item.tabName} key={item.key} className="overflow-auto mb-2" style={{ height: 300 }}>
                <ShowIconList
                  iconType={item.key}
                  iconSelected={iconSelected}
                  setIconSelected={setIconSelected}
                />
                {/* {
                  getIconList(item.key).map(({ type, icon: IconItem }) => {
                    return (
                      <div
                        className={
                          iconSelected === type
                            ? 'float-left text-xl p-2 m-1 bg-blue-500 text-white cursor-pointer'
                            : 'float-left text-xl p-2 m-1 cursor-pointer'
                        }
                        key = {type}
                        onClick={() => {
                          setIconSelected(type);
                        }}
                      >
                        <IconItem/>
                      </div>
                    );
                  })
                } */}
              </TabPane>
            );
          })
        }
      </Tabs>
      <ModalFooter
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </>
  );
};
