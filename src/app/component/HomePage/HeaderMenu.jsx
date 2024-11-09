"use client";
import { deleteCookie, Email, TOKEN, USER_LOGIN } from '@/app/setting/setting';
import { UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const HeaderMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { userLogin } = useSelector((state) => state.userReducer) || {}; 

  const handleUserClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(Email);
    localStorage.removeItem(USER_LOGIN);
    deleteCookie(USER_LOGIN);
    window.location.reload(); 
  };

  const userDropdown = () => {
    return (
      <ul
        className="dropdown-menu show"
        style={{
          fontSize: '15px',
          position: 'absolute',
          top: '100%',
          left: '0',
          transform: 'translateY(13px)',
          zIndex: 1000,
          minWidth: '150px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '5px',
          padding: '10px 0',
        }}
      >
        {!userLogin || Object.keys(userLogin).length === 0 ? ( 
          <>
            <li className="dropdown-item">
              <Link href="/register" className="text-decoration-none text-dark">Đăng ký</Link>
            </li>
            <li className="dropdown-item">
              <Link href="/login" className="text-decoration-none text-dark">Đăng nhập</Link>
            </li>
          </>
        ) : (
          <>
            <li className="dropdown-item">
              <Link href="/profile" className="text-decoration-none text-dark">Profile</Link>
            </li>
            {userLogin.role === "ADMIN" && (
              <li className="dropdown-item">
                <Link href="/admin/users" className="text-decoration-none text-dark">Page To Admin</Link>
              </li>
            )}
            <li className="dropdown-item">
              <Link href="/" className="text-decoration-none text-dark" onClick={handleLogout}>Đăng Xuất</Link>
            </li>
          </>
        )}
      </ul>
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container d-flex justify-content-between align-items-center">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <Image src="/assets/img/airbnb.svg" alt="Logo" width={30} height={30} priority crossOrigin="anonymous" />
            <span className="site-name ms-2">Airbnb</span>
          </Link>

          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">About</Link>
            </li>
            <li className="nav-item">
              <Link href="/services" className="nav-link">Services</Link>
            </li>
            <li className="nav-item">
              <Link href="/pricing" className="nav-link">Pricing</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>

          <div
            className="d-flex align-items-center position-relative user-link"
            onClick={handleUserClick}
            style={{ cursor: 'pointer' }}
          >
            {isClient && userLogin?.avatar ? (
              <img src={userLogin.avatar} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }} />
            ) : (
              <UserOutlined className="user-icon" />
            )}
            <span className='ms-2'>{isClient && userLogin ? userLogin.name : "Đăng nhập"}</span>
            {showDropdown && userDropdown()}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HeaderMenu;
