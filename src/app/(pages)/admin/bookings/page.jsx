'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Space, Table, Input, Button, Modal, Form, notification } from 'antd';
import { EditOutlined, DeleteOutlined, StopOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { createBookingAsync, deleteBookingAsync, fetchBookingsAsync, updateBookingAsync } from '@/app/redux/reducers/admin/BookingReducer';
import dayjs from 'dayjs';

const Booking = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector(state => state.BookingReducer);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = React.useState(false);
  const [editingBooking, setEditingBooking] = React.useState(null);
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchBookingsAsync());
  }, [dispatch]);

  const handleAddBooking = () => {
    form.resetFields();
    setEditingBooking(null);
    setIsModalVisible(true);
  };

  const handleEditBooking = (record) => {
    setEditingBooking(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteBooking = (bookingId) => {
    dispatch(deleteBookingAsync(bookingId));
  };

  const handleViewDetails = (record) => {
    setSelectedBooking(record);
    setIsDetailModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingBooking) {
        const updatedValues = { ...values, id: editingBooking.id };
        dispatch(updateBookingAsync(editingBooking.id, updatedValues));
        notification.success({ message: 'Thành công', description: 'Cập nhật đặt phòng thành công!' });
      } else {
        dispatch(createBookingAsync(values));
        notification.success({ message: 'Thành công', description: 'Đặt phòng thành công!' });
      }
      setIsModalVisible(false);
    }).catch(errorInfo => {
      console.error('Validation Failed:', errorInfo);
    });
  };

  const columns = [
    { title: 'Mã đặt phòng', dataIndex: 'id', key: 'id' },
    { title: 'Mã phòng', dataIndex: 'maPhong', key: 'maPhong' },
    { title: 'Mã người dùng', dataIndex: 'maNguoiDung', key: 'maNguoiDung' },
    {
      title: 'Ngày đến',
      dataIndex: 'ngayDen',
      key: 'ngayDen',
      render: date => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày đi',
      dataIndex: 'ngayDi',
      key: 'ngayDi',
      render: date => dayjs(date).format('DD/MM/YYYY'),
    },
    { title: 'Số khách', dataIndex: 'soLuongKhach', key: 'soLuongKhach' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span>
          <StopOutlined style={{ color: status === 'Cancelled' ? 'red' : 'green' }} />
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined style={{ color: 'purple', cursor: 'pointer' }} onClick={() => handleViewDetails(record)} />
          <EditOutlined style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleEditBooking(record)} />
          <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteBooking(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Quản Lý Booking</h2>
      <Space style={{ marginBottom: '20px' }}>
        <Input.Search placeholder="Nhập từ khóa tìm kiếm..." style={{ width: '300px' }} />
        <Button
          style={{ backgroundColor: '#fe6b6e', borderColor: '#fe6b6e' }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddBooking}>Thêm Đặt Phòng</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingBooking ? "Cập Nhật Đặt Phòng" : "Thêm Đặt Phòng"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="maPhong"
            label="Mã Phòng"
            rules={[{ required: true, message: 'Vui lòng nhập mã phòng' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="maNguoiDung"
            label="Mã Người Dùng"
            rules={[{ required: true, message: 'Vui lòng nhập mã người dùng' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="ngayDen"
            label="Ngày Đến"
            rules={[{ required: true, message: 'Vui lòng nhập ngày đến' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="ngayDi"
            label="Ngày Đi"
            rules={[
              { required: true, message: 'Vui lòng nhập ngày đi' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || dayjs(value).isAfter(getFieldValue('ngayDen'))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Ngày đi phải sau ngày đến'));
                },
              }),
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="soLuongKhach"
            label="Số Khách"
            rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi Tiết Đặt Phòng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {selectedBooking ? (
          <div>
            <p><strong>Mã Đặt Phòng:</strong> {selectedBooking.id}</p>
            <p><strong>Mã Phòng:</strong> {selectedBooking.maPhong}</p>
            <p><strong>Mã Người Dùng:</strong> {selectedBooking.maNguoiDung}</p>
            <p><strong>Ngày Đến:</strong> {dayjs(selectedBooking.ngayDen).format('DD/MM/YYYY')}</p>
            <p><strong>Ngày Đi:</strong> {dayjs(selectedBooking.ngayDi).format('DD/MM/YYYY')}</p>
            <p><strong>Số Khách:</strong> {selectedBooking.soLuongKhach}</p>
            <p><strong>Trạng Thái:</strong> {selectedBooking.status}</p>
          </div>
        ) : <p>Không có thông tin để hiển thị.</p>}
      </Modal>
    </div>
  );
};

export default Booking;
