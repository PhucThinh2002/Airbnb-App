"use client"
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Category from './HomePage/Category';
import { fetchLocationsByPageAsync } from '../redux/reducers/locationReducer';
import { useRouter } from 'next/navigation';

const Content = () => {
    const dispatch = useDispatch();
    const { locations, loading, error } = useSelector((state) => state.locationReducer);
    const router = useRouter();
    useEffect(() => {
        dispatch(fetchLocationsByPageAsync());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const drivingTimes = [
        '15 phút đi xe', '3 giờ đi xe', '6.5 giờ đi xe', '15 phút đi xe',
        '7.5 giờ đi xe', '45 phút đi xe', '30 phút đi xe', '5 giờ đi xe'
    ];

    const handleLocationClick = (location) => {
    const URL = `/rooms/${location.id}?location=${location.tenViTri}&date={}&count=1`;
    router.push(URL);
    };

    return (
        <div className="content-container mt-2">
            <Category />
            
            <div className="featured-locations mt-2">
                <h4>Địa điểm nổi bật</h4>
                <div className="row text-center">
                    {locations.slice(0, 8).map((location, index) => (
                        <div className="col-md-3" key={location.id}>
                            <div 
                                className="location-card" 
                                onClick={() => handleLocationClick(location)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Image
                                    src={location.hinhAnh}
                                    alt={location.tenViTri}
                                    className="img-fluid"
                                    width={200}
                                    height={150}
                                    style={{ objectFit: 'cover' }}
                                />
                                <p>{location.tenViTri}</p>
                                <small>{location.tinhThanh}</small>
                                <small>{drivingTimes[index]}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <h4>Ở bất cứ đâu</h4>
            <div className="row text-center">
                {["content3.jpg", "content2.jpg", "content1.jpg", "content.jpg"].map((image, index) => (
                    <div className="col-md-3" key={index}>
                        <div className="location-card">
                            <Image 
                                src={`/assets/img/${image}`}
                                alt={`Accommodation ${index + 1}`}
                                className="img-fluid"
                                width={200}
                                height={150}
                                style={{ objectFit: 'cover' }}
                            />
                            <p>{["Toàn bộ nhà", "Chỗ ở độc đáo", "Trang trại và thiên nhiên", "Cho phép mang theo thú cưng"][index]}</p>
                            <small>{["Trải nghiệm không gian riêng tư và đầy đủ tiện nghi", "Khám phá những chỗ ở với phong cách đặc trưng và khác biệt", "Đắm chìm trong không gian xanh mát của thiên nhiên", "Không gian thân thiện và an toàn cho thú cưng của bạn"][index]}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Content;