import React from 'react';
import { Button, ShowModal, CloseModal } from '@infra/ui';
import { getAppPreviewUrl } from '@provider-app/config';

import { previewAppService } from '@provider-app/services';
import { PageConfigContainer } from "./PDPageConfiguration";
import { PlatformContext } from '@provider-app/page-designer/utils';

const isDevEnv = process.env.NODE_ENV === 'development';

const ReleaseBtn = ({
  onReleasePage
}: ToolbarCustomProps) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      loading={loading}
      onClick={(e) => {
        setLoading(true);
        onReleasePage?.().finally(() => {
          setTimeout(() => setLoading(false), 800);
          });
      }}
    >
      保存
    </Button>
  );
};

interface ToolbarCustomProps {
  onReleasePage?: () => Promise<unknown>
  flatLayoutItems
  appLocation
  pageMetadata
}

const ToolbarCustom: React.FC<ToolbarCustomProps> = ({
  onReleasePage,
  flatLayoutItems,
  pageMetadata,
  appLocation
}) => {
  const previewUrl = getAppPreviewUrl({
    ...appLocation,
    defaultPath: 'preview',
    mode: 'preview',
    appName: appLocation.appName
  });
  return (
    <PlatformContext.Consumer>
      {
        (platformCtx) => {
          return (
            <div className="flex items-center px-2" style={{ height: '100%' }}>
              <span className="text-gray-500">新手教程制作中，敬请期待</span>
              <span className="flex"></span>
              <Button
                className="mr10"
                color="default"
                onClick={(e) => {
                  const modalID = ShowModal({
                    title: '页面设置',
                    width: 900,
                    children: ({ close }) => {
                      return (
                        <PageConfigContainer
                          platformCtx = {platformCtx}
                          pageMetadata={pageMetadata}
                          flatLayoutItems={flatLayoutItems}
                        />
                      );
                    },
                    onClose: ()=>{
                      CloseModal(modalID);
                    }
                  });
                }}
              >
        页面设置
              </Button>
              <Button
                color="default"
                className="mr10"
                onClick={(e) => {
                  // $R_P.get('/manage/v1/application/preview/')
                  previewAppService(appLocation.app);
                  // previewAppService('1319181529431285760');
                  ShowModal({
                    title: `PC 预览 ${isDevEnv ? previewUrl : ''}`,
                    modalType: 'side',
                    position: 'bottom',
                    maxHeightable: false,
                    children: () => {
                      return (
                        <div style={{
                          height: '80vh'
                        }}
                        >
                          <iframe src={previewUrl} width="100%" height="100%" frameBorder="0" />
                        </div>
                      );
                    }
                  });
                }}
              >
        预览
              </Button>
              {/* <Button
        hola
        color="default"
        className="mr10"
        onClick={(e) => {
          ShowModal({
            title: 'Mobile 预览',
            width: 500,
            children: () => {
              const previewUrl = getAppPreviewUrl(appLocation);
              return (
                <div style={{
                  height: '70vh',
                }}
                >
                  <iframe src={previewUrl} width="100%" height="100%" frameBorder="0" />
                </div>
              );
            }
          });
        }}
      >
          手机预览
      </Button> */}
              <ReleaseBtn onReleasePage={onReleasePage} />
              {/* <Button
          className="mr10"
        >
          返回
        </Button> */}
            </div>
          );
        }
      }
    </PlatformContext.Consumer>
  );
};

export default ToolbarCustom;
