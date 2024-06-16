import React, { useEffect, useState } from "react";
import classes from "../../assets/styles/Form.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser, editUser } from "../../redux/userSlice";
import { nanoid } from "nanoid";

const Form = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const userInit = {
    firstName: "",
    lastName: "",
    address: "",
    birthday: "",
    department: "",
  };
  const [user, setUser] = useState(userInit);
  const [msgError, setMsgError] = useState({
    firstName: "",
    lastName: "",
    address: "",
    birthday: "",
    department: "",
    // position: '',
  });
  const messageError = {
    firstName: "",
    lastName: "",
    address: "",
    birthday: "",
    department: "",
    // position: '',
  };
  const handleChangeUser = (e) => {
    e.preventDefault();
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
    setMsgError((prevUser) => ({
      ...prevUser,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async () => {
    // validate user name and password
    if (!user?.firstName?.trim()) {
      messageError.firstName = "💀First name is require";
    }
    if (!user?.lastName?.trim()) {
      messageError.lastName = "💀Last name is require";
    }
    if (!user?.address?.trim()) {
      messageError.address = "💀Address is require";
    }
    if (!user?.birthday?.trim()) {
      messageError.birthday = "💀birthday is require";
    }
    if (!user?.department?.trim()) {
      messageError.department = "💀department is require";
    }
    setMsgError({
      ...msgError,
      firstName: messageError.firstName,
      lastName: messageError.lastName,
      address: messageError.address,
      birthday: messageError.birthday,
      department: messageError.department,
    });
    // const check = Object.values(msgError).every(value => value === '')
    // console.log('check', check)
    if (
      !!user?.firstName?.trim() &&
      !!user?.lastName?.trim() &&
      !!user?.address?.trim() &&
      !!user?.birthday?.trim() &&
      !!user?.department?.trim()
    ) {
      const newUser = {
        ...user,
        id: nanoid(10),
      };
      if (!params?.id) {
        await createUser(newUser);
      } else {
        await editUser(params.id, newUser);
        props?.resetUserDetail();
      }
      navigate("/user");
    }
  };
  // console.log(props)

  useEffect(() => {
    if (props?.userDetail) {
      setUser({
        ...user,
        firstName: props?.userDetail?.firstName,
        lastName: props?.userDetail?.lastName,
        address: props?.userDetail?.address,
        birthday: props?.userDetail?.birthday,
        department: props?.userDetail?.department,
      });
    }
  }, [props?.userDetail]);

  return (
    <div className={classes.form}>
      <div className={classes.form__item}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          placeholder="Enter your first name"
          name="firstName"
          value={user?.firstName}
          onChange={handleChangeUser}
        />
      </div>
      <div className={classes.form__item}>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          placeholder="Enter your last name"
          name="lastName"
          value={user?.lastName}
          onChange={handleChangeUser}
        />
      </div>
      <div className={classes.form__item}>
        <label htmlFor="address">Address</label>
        <textarea
          name="address"
          id="address"
          cols="30"
          rows="10"
          placeholder="Enter your address"
          value={user?.address}
          onChange={handleChangeUser}
        ></textarea>
      </div>
      <div className={classes.form__item}>
        <label htmlFor="birthday">Birthday</label>
        <input
          type="date"
          name="birthday"
          id="birthday"
          value={user?.birthday}
          onChange={handleChangeUser}
        />
      </div>
      <div className={classes.form__item}>
        <label htmlFor="department">Department</label>
        <select
          name="department"
          id="department"
          value={user?.department}
          onChange={handleChangeUser}
        >
          <option value="vti">VTI Group</option>
          <option value="fsoft">FPT Software</option>
          <option value="framgia">Framgia</option>
          <option value="samsung">Samsung</option>
        </select>
      </div>

      <div className={classes.message__error}>
        <p>{msgError?.firstName}</p>
        <p>{msgError?.lastName}</p>
        <p>{msgError?.address}</p>
        <p>{msgError?.birthday}</p>
        <p>{msgError?.department}</p>
      </div>
      <div className={classes.form__item}>
        <button onClick={handleSubmit}>
          {props?.userDetail ? "Edit" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default Form;
