"use client";
import React, { useEffect, useState } from "react";
import { getCookie, http, USER_LOGIN } from "../setting/setting";
import { useDispatch, useSelector } from "react-redux";
import { message, Modal } from "antd";
import { datPhongActionAsync } from "../redux/reducers/bookReducer";

const CardPayRoom = (props) => {
  const { roomDetail, idRoom } = props;
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`
  };
  
  const [comments, setComments] = useState([]);
  let { count } = props;
  if (count > roomDetail.khach) {
    count = roomDetail.khach
  }
  
  const [countGuest, setCountGuest] = useState(+count || 1);
  const [checkInDate, setCheckInDate] = useState(formatDate(props.date[0] || ""));
  const [checkOutDate, setCheckOutDate] = useState(formatDate(props.date[1]) || "");
  const [userProfile, setUserProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for controlling modal visibility
  const dispatch = useDispatch();

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      const differenceInTime = checkOut - checkIn;
      const differenceInNights = differenceInTime / (1000 * 3600 * 24);

      return differenceInNights;
    }
    return 0;
  };

  const night = calculateNights();
  
  const handleCheckInChange = (e) => {
    const selectedDate = e.target.value;
    setCheckInDate(selectedDate);
    if (checkOutDate && checkOutDate < selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const handleCheckOutChange = (e) => {
    setCheckOutDate(e.target.value);
  };

  const getCommentByRoom = async () => {
    try {
      const res = await http.get(`/api/binh-luan/lay-binh-luan-theo-phong/${idRoom}`);
      setComments(res.data.content);
    } catch (error) {
      console.error("Không thể tải bình luận cho phòng:", error);
    }
  };

  const calculateAverageRating = (comments) => {
    if (comments.length === 0) return 0;

    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.saoBinhLuan,
      0
    );
    return (totalRating / comments.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(comments);

  useEffect(() => {
    const user = JSON.parse(getCookie(USER_LOGIN)) || null;
    setUserProfile(user);
    getCommentByRoom();
  }, [idRoom]);

  // Function to show confirmation modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle confirm action
  const handleOk = async () => {
    if (!userProfile) {
      message.error("Bạn cần đăng nhập để có thể đặt phòng");
      setIsModalVisible(false);
      return;
    }

    if (!checkInDate || !checkOutDate || countGuest <= 0) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      setIsModalVisible(false);
      return;
    }

    try {
      const action = datPhongActionAsync(
        0,
        roomDetail.id,
        checkInDate,
        checkOutDate,
        countGuest,
        userProfile ? userProfile.id : null
      );
      await dispatch(action);
      message.success("Đặt phòng thành công");
      setIsModalVisible(false); // Close the modal after successful booking
    } catch (err) {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
      setIsModalVisible(false);
    }
  };

  // Function to handle cancel action
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <strong>{roomDetail.giaTien}$ </strong> / night
          </div>
          <div>
            <span className="text-danger">★</span> {averageRating}(
            <a href="#">{comments.length} đánh giá</a>)
          </div>
        </div>

        <div className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between mb-2 border-bottom">
            <div className="w-50 text-center p-2">
              <div>Nhận phòng</div>
              <input
                type="date"
                value={checkInDate}
                onChange={handleCheckInChange}
              />
            </div>
            <div className="w-50 text-center p-2 border-start">
              <div>Trả phòng</div>
              <input
                type="date"
                value={checkOutDate}
                min={checkInDate}
                onChange={handleCheckOutChange}
              />
            </div>
          </div>
          <div className="mt-4">
            <div>Khách tối đa: {roomDetail.khach}</div>
            <div className=" mt-3 text-center ">
              <div>
                <button
                  className="btn btn-outline-danger mx-5 btn-sm rounded-circle"
                  style={{
                    width: "36px",
                    height: "36px",
                    lineHeight: "24px",
                    padding: "0",
                    fontSize: "24px"
                  }}
                  onClick={() => {
                    if (countGuest > 1) {
                      setCountGuest(countGuest - 1);
                    }
                  }}
                >
                  -
                </button>
                <span className="mx-2">{countGuest} khách</span>
                <button
                  className="btn btn-outline-danger mx-5 btn-sm rounded-circle"
                  style={{
                    width: "36px",
                    height: "36px",
                    lineHeight: "24px",
                    padding: "0",
                    fontSize: "24px"
                  }}
                  onClick={() => {
                    if (countGuest < roomDetail.khach) {
                      setCountGuest(countGuest + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          className="btn btn-danger w-100 mb-3"
          onClick={showModal} // Show confirmation modal
        >
          Đặt phòng
        </button>

        {/* Confirmation Modal */}
        <Modal
          title="Xác nhận đặt phòng"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <div>
            <p><strong>Ngày nhận phòng:</strong> {checkInDate}</p>
            <p><strong>Ngày trả phòng:</strong> {checkOutDate}</p>
            <p><strong>Số khách:</strong> {countGuest}</p>
            <p><strong>Tổng tiền:</strong> {roomDetail.giaTien * night - (night === 0 ? 0 : 8)}$</p>
          </div>
        </Modal>

        <div className="mb-2 d-flex justify-content-between">
          <div>
            {roomDetail.giaTien}$ X {night} nights
          </div>
          <div>{roomDetail.giaTien * night}</div>
        </div>
        <div className="mb-2 d-flex justify-content-between">
          <div>Cleaning fee</div>
          <div>$8</div>
        </div>
        <hr />
        <div className="d-flex justify-content-between">
          <strong>Total before taxes</strong>
          <strong>{roomDetail.giaTien * night - (night === 0 ? 0 : 8)}</strong>
        </div>
      </div>
    </div>
  );
};

export default CardPayRoom;

