import React from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createLocationAsync, uploadLocationImageAsync } from '@/app/redux/reducer/adminReducer/locationApiReducer';

const AddLocationModal = ({ isOpen, onClose, onAddSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      // Bước 1: Tạo vị trí mới
      const newLocationAction = await dispatch(createLocationAsync({
        tenViTri: values.tenViTri,
        tinhThanh: values.tinhThanh,
        quocGia: values.quocGia,
        hinhAnh: ''
      }));
      
      const newLocation = newLocationAction.payload;

      // Bước 2: Upload hình ảnh nếu có
      if (values.hinhAnh && values.hinhAnh[0]?.originFileObj) {
        const formData = new FormData();
        formData.append('formFile', values.hinhAnh[0].originFileObj);
        
        await dispatch(uploadLocationImageAsync({ 
          id: newLocation.id, 
          formData 
        }));
      }

      message.success('Vị trí mới đã được thêm thành công!');
      form.resetFields();
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding new location:', error);
      message.error('Có lỗi xảy ra khi thêm vị trí mới');
    }
  };

  return (
    <Modal
      title="Thêm vị trí mới"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="tenViTri" label="Tên vị trí" rules={[{ required: true, message: 'Vui lòng nhập tên vị trí' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tinhThanh" label="Tỉnh thành" rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="quocGia" label="Quốc gia" rules={[{ required: true, message: 'Vui lòng nhập quốc gia' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="hinhAnh" label="Hình ảnh" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
          <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Thêm mới</Button>
          <Button onClick={onClose} style={{ marginLeft: 8 }}>Hủy</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLocationModal;