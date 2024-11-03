import { getApiRoomByIdLocationAction } from '@/app/actions/service/roomApi';
import FooterComponent from '@/app/component/FooterComponent';
import HeaderMenu from '@/app/component/HomePage/HeaderMenu';
import { Card, Carousel } from 'antd';
import Link from 'next/link';
import React from 'react';

const capitalizeWords = (str) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
const formatDate = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('-');
  return `${day}/${month}/${year}`;
};
const Location = async ({ params, searchParams }) => {
  const idLocation = params.location;
  const selectedDate = searchParams.date ? JSON.parse(decodeURIComponent(searchParams.date)) : null;

  const locationSlug = searchParams.location ? decodeURIComponent(searchParams.location) : '';
  const locationName = capitalizeWords(locationSlug);
  
  const ApiRoomLocation = await getApiRoomByIdLocationAction(idLocation);
  const renderAllRoomLocation = () => {
    return ApiRoomLocation.map((item, index) => (
      <div key={index}>
        <Link href={`/room-detail/${item.id}`} style={{ textDecoration: 'none' }}>
          <div className="card m-3" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <div className="row g-0">
              <div className="col-md-6">
                <Carousel dots={false} arrows>
                  <div>
                    <img
                      alt="example"
                      src={item.hinhAnh}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <img
                      alt="example"
                      src={item.hinhAnh}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                </Carousel>
              </div>
              <div className="col-md-6 d-flex flex-column justify-content-between p-2">
                <div>
                  <p
                    className="text-muted"
                    title={`Toàn bộ căn hộ dịch vụ tại ${locationName}`}
                    style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis', 
                    }}
                  >
                    Toàn bộ căn hộ dịch vụ tại {locationName}
                  </p>
                  <h5
                    className="mt-2"
                    title={item.tenPhong}
                    style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.tenPhong}
                  </h5>
                  <hr />
                  <p
                    className="text-muted mb-1"
                    title={
                      `${item.khach !== 0 ? `Khách: ${item.khach} ` : ''}` +
                      `${item.phongNgu !== 0 ? `| Phòng ngủ: ${item.phongNgu} ` : ''}` +
                      `${item.giuong !== 0 ? `| Giường: ${item.giuong} ` : ''}` +
                      `${item.phongTam !== 0 ? `| Phòng tắm: ${item.phongTam}` : ''}`
                    }
                    style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      fontSize: '14px'
                    }}
                  >
                    {item.khach !== 0 && `Khách: ${item.khach} `}
                    {item.phongNgu !== 0 && `| Phòng ngủ: ${item.phongNgu} `}
                    {item.giuong !== 0 && `| Giường: ${item.giuong} `}
                    {item.phongTam !== 0 && `| Phòng tắm: ${item.phongTam}`}
                  </p>
                    <p style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      fontSize: '14px'
                    }} className="text-muted mb-1" title = {
                      `${item.mayGiat ? "Máy giặt ": ""}` +
                      `${item.banLa ? " Bàn là ": ""}` +
                      `${item.tivi ? " TiVi ": ""}` +
                      `${item.dieuHoa ? " Điều hòa ": ""}` +
                      `${item.wifi ? " Wifi ": ""}` +
                      `${item.bep ? " Bếp ": ""}` +
                      `${item.doXe ? " Đỗ xe ": ""}` +
                      `${item.hoBoi ? " Hồ bơi ": ""}` 
                    }>
                    {item.mayGiat && "| Máy giặt "}
                    {item.banLa && "| Bàn là "}
                    {item.tivi && "| TiVi "}
                    {item.dieuHoa && "| Điều hòa "}
                    {item.wifi && "| Wifi "}
                    {item.bep && "| Bếp "}
                    {item.doXe && "| Đỗ xe "}
                    {item.hoBoi && "| Hồ bơi "}
                    </p>
                </div>
              </div>
            </div>
          </div>
        </Link>


      </div>
    ));
  };
  
  return (
    <div >
      <HeaderMenu/>
    <div className="container my-5 py-3">
      <p>Có {ApiRoomLocation.length} chỗ ở tại {locationName}</p>
      {selectedDate && selectedDate.length > 0 ? `Từ ${formatDate(selectedDate[0])} Đến ${formatDate(selectedDate[1])}` : ""}
      <h1>Danh sách phòng khu vực bạn đã chọn </h1>
      <div className="row">
        <div className="col-md-6">
          {renderAllRoomLocation()}
        </div>
        <div className="col-md-6">
        
        </div>
      </div>
    </div>
    <FooterComponent/>
    </div>
  );
};

export default Location;