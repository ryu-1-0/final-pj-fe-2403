import React, { useEffect, useState } from "react";
import Form from "./common/Form";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserDetail = () => {
  const [userDetail, setUserDetail] = useState(null)
  const userID = useParams()
  const getUserByID = async () => {
    const res = await axios.get(`http://localhost:3001/users/${userID.id}`)
    setUserDetail(res?.data)
  }
  const resetUserDetail = () => {
    setUserDetail(null)
  }
  useEffect(() => {
    getUserByID()
  }, [])
  return (
    <div className="container">
      <Form userDetail={userDetail} resetUserDetail={resetUserDetail} />
    </div>
  );
};

export default UserDetail;
