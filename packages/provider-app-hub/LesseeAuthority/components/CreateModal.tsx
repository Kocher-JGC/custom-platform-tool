import React from 'react';
import { Modal } from 'antd';

interface IProps {
  modalVisible: boolean;
  onCancel: () => void;

  title: string;
  children?: React.ReactElement;
}

export const CreateModal: React.FC<IProps> = (props) => {
  const { modalVisible, onCancel, title } = props;

  return (
    <Modal
      width="600px"
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
};

// export const CreateModalFast: React.FC<IProps> = React.memo((props) => {
//   const { modalVisible, onCancel, title } = props;

//   return (
//     <Modal
//       width="800px"
//       className="create-table-modal"
//       destroyOnClose
//       title={title}
//       visible={modalVisible}
//       onCancel={() => onCancel && onCancel()}
//       footer={null}
//       okText="确认"
//       maskClosable={false}
//       cancelText="取消"
//     >
//       {props.children}
//     </Modal>
//   );
// });

export default React.memo(CreateModal);
