import React, { useEffect, useState } from "react"
import classes from "../assets/styles/UserList.module.scss"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { deleteManyUser, deleteUserByID, getUserAll, getUsersList } from "../redux/userSlice"
import { Table } from "antd"
import ModalComponent from "./ModalComponent/ModalComponent"
import { Pagination } from "react-bootstrap"
const UserList_cp = () => {
  const navigate = useNavigate()
  const userList = useSelector((store) => store.userList.userList)
  const dispatch = useDispatch()
  const [inputSearch, setInputSearch] = useState('')

  //================================================================
  const [totalUsers, setTotalUsers] = useState(0)

  async function fetchData() {
    const users = await getUserAll()
    setTotalUsers(users.length)
  }
  const [limit, setLimit] = useState(5)
  const [activePage, setActivePage] = useState(1)
  const totalPages = Math.ceil(totalUsers / limit)
  const handlePageChange = (pageNumber) => {
    dispatch(getUsersList({ page: pageNumber, limit }))
    setActivePage(pageNumber)
  }
  const renderPaginationItems = () => {
    const paginationItems = []

    if (activePage > 3) {
      paginationItems.push(<Pagination.Ellipsis key="dots1" />)
    }

    for (let i = activePage - 1; i <= activePage + 1; i++) {
      if (i > 1 && i < totalPages) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            onClick={() => handlePageChange(i)}
            active={activePage === i}
          >
            {i}
          </Pagination.Item>
        )
      }
    }

    if (activePage < totalPages - 2) {
      paginationItems.push(<Pagination.Ellipsis key="dots2" />)
    }
    return paginationItems
  }
  //================================================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const [isModalOpenDelConfirm, setIsModalOpenDelConfirm] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpenDel(false);
    setIsModalOpenDelConfirm(false)
  };

  //================================================================
  const handleCancelDeleteUser = () => {
    setIsModalOpenDel(false);

  }

  const handleDeleteUser = async () => {
    setIsModalOpenDel(false);
    // selectedRowKeys.forEach(async (key) => {
    //   // console.log('key', key)
    //   await deleteUserByID(key)
    // })
    deleteManyUser(selectedRowKeys)
    // setUserSelected(null)
    await dispatch(getUsersList({ page: 1, limit }))

  }
  //================================================================
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const handleConfirmDeleteUser = () => {
    if (selectedRowKeys.length === 0) {
      setIsModalOpenDelConfirm(true)

    } else {
      setIsModalOpenDel(true)


    }

  }
  const handleEditUser = () => {
    // console.log('selectedRowKeys', selectedRowKeys)
    if (selectedRowKeys.length === 0) {
      setIsModalOpen(true)

    } else if (selectedRowKeys.length === 1) {
      navigate(`/user/${selectedRowKeys}`)

    }
    else {
      setIsModalOpen(true);

    }
  }

  const renderAction = () => {
    return (
      <div className="d-flex gap-1">
        <button className={`${classes.btn} ${classes.btn__edit}`}
          onClick={handleEditUser}>
          Edit
        </button>
        <button
          className={`${classes.btn} ${classes.btn__delete}`}
          onClick={handleConfirmDeleteUser}
        >
          Delete
          {/* <Popconfirm title="Sure to delete?"
            onConfirm={() => handleDeleteUser()}
          >
            Delete
          </Popconfirm> */}
        </button>
      </div >
    )
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      withd: 120,
    },
    {
      title: 'First Name',
      sortDirections: ['ascend', 'descend'],
      dataIndex: 'firstName',
      withd: 150,

      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      sortDirections: ['descend', 'ascend'],
      withd: 150,
      fixed: 'left',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      withd: 250,
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: 'Birthday',
      withd: 150,
      dataIndex: 'birthday',
      sorter: (a, b) => new Date(a.birthday) - new Date(b.birthday),
    },
    {
      title: 'Department',
      withd: 200,
      dataIndex: 'department',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      withd: 250,
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ]
  const dataTable =
    userList?.length &&
    userList?.filter((user) =>
      user.lastName.toLowerCase().includes(inputSearch.toLowerCase())
      || user.firstName.toLowerCase().includes(inputSearch.toLowerCase())
    )
      .map((user) => {
        return {
          ...user,
          key: user.id,
        }
      })

  useEffect(() => {

    fetchData()
  }, [])
  useEffect(() => {
    dispatch(getUsersList({ page: 1, limit }))
  }, [limit])
  return (
    <div>
      <div className="container">
        <div className="d-flex align-item-center column-gap-2 ">
          <div>
            <Link
              to="user/create"
              className={`${classes.btn} ${classes.btn__create__new}`}
            >
              Create New User
            </Link>
          </div>
          <div>
            <input className={classes.search} type="text" name="search" placeholder='Search user'
              value={inputSearch}
              onChange={(e) => {
                setInputSearch(e.target.value)
              }}
            />
          </div>


        </div>

        <Table
          bordered
          columns={columns}
          dataSource={dataTable}
          rowSelection={rowSelection}
          pagination={false}
        // scroll={{
        //   // x: 800,
        //   y: 400,
        // }}
        />
        <div className="d-flex justify-content-end align-item-center column-gap-2 mt-3 ">
          {/* <Pagination
            showQuickJumper
            defaultCurrent={1}
            total={500}
            onChange={onChange}
            pageSizeOptions={[1, 5, 10, 20]}
          /> */}
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={activePage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(activePage - 1)} disabled={activePage === 1} />
            <Pagination.Item onClick={() => handlePageChange(1)} disabled={activePage === 1} >{1}</Pagination.Item>

            {renderPaginationItems()}
            <Pagination.Item onClick={() => handlePageChange(totalPages)} disabled={activePage === totalPages} >{totalPages}</Pagination.Item>
            <Pagination.Next onClick={() => handlePageChange(activePage + 1)} disabled={activePage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={activePage === totalPages} />
          </Pagination>
        </div>

      </div>
      <ModalComponent
        title='Delete User'
        onOk={handleDeleteUser}
        onCancel={handleCancelDeleteUser}
        open={isModalOpenDel}
        closable={false}
        style={{ top: '40%' }}
        okButtonProps={{ style: { background: '#301cd9' } }}

      >
        <p>Are you sure to delete user?</p>

      </ModalComponent>
      <ModalComponent
        title='Delete User Confirmation'
        onOk={handleOk}
        open={isModalOpenDelConfirm}
        closable={false}
        style={{ top: '40%' }}
        // centered
        okButtonProps={{ style: { background: '#301cd9' } }}

        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Please select 1 user to Delete</p>

      </ModalComponent>

      <ModalComponent
        title="Edit user"
        open={isModalOpen}
        onOk={handleOk}
        closable={false}
        style={{ top: '40%' }}
        // centered
        okButtonProps={{ style: { background: '#301cd9' } }}

        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Please select 1 user to edit</p>
        <p>Only 1 user can be selected for editing...</p>
      </ModalComponent>
    </div >
  )
}

export default UserList_cp
