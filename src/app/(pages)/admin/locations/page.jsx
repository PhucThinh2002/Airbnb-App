'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Input, Modal, Form, Upload, message, Steps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLocationsAsync,
  createLocationWithImageAsync,
  updateLocationAsync,
  deleteLocationAsync,
} from '@/app/redux/reducers/admin/locationApiReducer';

const { Step } = Steps;

const Location = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locationApiReducer.locations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const loading = useSelector((state) => state.locationApiReducer.loading);
  const [selectedImage, setSelectedImage] = useState(null);
  const [locationData, setLocationData] = useState({
    tenViTri: '',
    tinhThanh: '',
    quocGia: '',
  });

  useEffect(() => {
    dispatch(fetchLocationsAsync());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchKeyword(value);
  };

  const handleEdit = (record) => {
    setEditingLocation(record);
    setLocationData({
      tenViTri: record.tenViTri,
      tinhThanh: record.tinhThanh,
      quocGia: record.quocGia,
    });
    setIsModalOpen(true);
    setCurrentStep(0);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa vị trí này?',
      onOk: () => {
        dispatch(deleteLocationAsync(id));
      },
    });
  };

  const handleUpdate = async () => {
    try {
      let result;
      if (editingLocation?.id) {
        // Update existing location
        result = await dispatch(
          createLocationWithImageAsync({ ...locationData, id: editingLocation.id }, selectedImage, editingLocation.id)
        ).unwrap();
        message.success("Cập nhật vị trí thành công!");
      } else {
        // Create new location
        result = await dispatch(
          createLocationWithImageAsync(locationData, selectedImage)
        ).unwrap();
        message.success('Thêm vị trí thành công!');
      }
      resetModal();
    } catch (error) {
      console.error("Error during update/create:", error);  
    }
  };


  const resetModal = () => {
    setEditingLocation(null);
    setIsModalOpen(false);
    form.resetFields(); // Reset the form fields
    setCurrentStep(0);
    setSelectedImage(null);
    setLocationData({
      tenViTri: '',
      tinhThanh: '',
      quocGia: '',
    });
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Validate step 1 fields
      try {
        await form.validateFields();
        setCurrentStep(1);
      } catch (error) {
        // Handle validation errors if needed
      }
    } else if (currentStep === 1) {
      await handleUpdate(); // Call handleUpdate when finishing the last step
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
    {
      title: 'Image',
      dataIndex: 'hinhAnh',
      key: 'hinhAnh',
      render: (image) => <img src={image} alt="Location" style={{ width: '80px', borderRadius: '5px' }} />,
      width: 100,
    },
    { title: 'Tên Vị Trí', dataIndex: 'tenViTri', key: 'tenViTri' },
    { title: 'Tỉnh Thành', dataIndex: 'tinhThanh', key: 'tinhThanh' },
    { title: 'Quốc Gia', dataIndex: 'quocGia', key: 'quocGia' },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="link" />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} type="link" danger />
        </Space>
      ),
    },
  ];

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name}`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}`);
    }
    if (info.fileList.length > 0) {
      setSelectedImage(info.fileList[0]?.originFileObj);
    } else {
      setSelectedImage(null);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Input.Search
          placeholder="Nhập từ khóa tìm kiếm..."
          style={{ width: '300px' }}
          onSearch={handleSearch}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button
          type="primary"
          style={{ backgroundColor: '#fe6b6e', borderColor: '#fe6b6e' }}
          onClick={() => {
            setEditingLocation(null);
            setIsModalOpen(true);
          }}
        >
          + Thêm vị trí mới
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={locations.filter(location =>
          location.tenViTri.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          location.tinhThanh.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          location.quocGia.toLowerCase().includes(searchKeyword.toLowerCase())
        )}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={editingLocation ? "Chỉnh sửa vị trí" : "Thêm vị trí mới"}
        visible={isModalOpen}
        onCancel={resetModal}
        footer={[
          <Button key="back" onClick={handlePrev} disabled={currentStep === 0}>
            Quay lại
          </Button>,
          <Button key="submit" type="primary" onClick={handleNext}>
            {currentStep === 1 ? 'Hoàn thành' : 'Tiếp theo'}
          </Button>,
        ]}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="Thông tin vị trí" />
          <Step title="Tải lên hình ảnh" />
        </Steps>
        <Form form={form} layout="vertical" initialValues={locationData}>
          {currentStep === 0 && (
            <>
              <Form.Item
                label="Tên Vị Trí"
                name="tenViTri"
                rules={[{ required: true, message: 'Vui lòng nhập tên vị trí!' }]}
              >
                <Input
                  value={locationData.tenViTri}
                  onChange={(e) =>
                    setLocationData({ ...locationData, tenViTri: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Tỉnh Thành"
                name="tinhThanh"
                rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành!' }]}
              >
                <Input
                  value={locationData.tinhThanh}
                  onChange={(e) =>
                    setLocationData({ ...locationData, tinhThanh: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Quốc Gia"
                name="quocGia"
                rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
              >
                <Input
                  value={locationData.quocGia}
                  onChange={(e) =>
                    setLocationData({ ...locationData, quocGia: e.target.value })
                  }
                />
              </Form.Item>
            </>
          )}
          {currentStep === 1 && (
            <Form.Item
              label="Hình ảnh"
              name="hinhAnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
            >
              <Upload
                name="logo"
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // Prevent auto-upload, manual upload only
                onChange={handleImageChange}
              >
                <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Modal>

    </div>
  );
};

export default Location;