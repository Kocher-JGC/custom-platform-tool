import React, { ReactElement } from 'react';
import { Modal } from 'antd';

interface IProps {
  modalVisible: boolean;
  onCancel: () => void;

  title: string;
  children?: React.ReactElement;
}

export const CreateModalFast: React.FC<IProps> = React.memo((props: IProps): ReactElement => {
  const { modalVisible, onCancel, title } = props;

  return (
    <Modal
      width="1200px"
      className="create-table-modal"
      destroyOnClose
      title={title}
      visible={modalVisible}
      onCancel={() => onCancel && onCancel()}
      footer={null}
      okText="确认"
      maskClosable={false}
      cancelText="取消"
    >
      {props.children}
    </Modal>
  );
});
