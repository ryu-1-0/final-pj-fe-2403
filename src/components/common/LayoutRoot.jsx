import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import classes from "../../assets/styles/LayoutRoot.module.scss";
import Header from "./Header";
import Footer from "./Footer";
import UserList_cp from "../UserList_cp";

const LayoutRoot = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const userToken = localStorage.getItem('userToken')
    if (!userToken) {
      navigate('/login')
    } else {
      navigate('/')

    }
  }, [])

  return (
    <div
      className={`d-flex justify-content-between flex-column ${classes.layout__root}`}
    >
      <Header />
      <UserList_cp />
      <Outlet />
      <Footer />
    </div>
  );
};

export default LayoutRoot;
