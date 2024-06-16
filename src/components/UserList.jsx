import React, { useEffect, useState } from "react"
import classes from "../assets/styles/UserList.module.scss"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { deleteUserByID, getUserAll, getUsersList } from "../redux/userSlice"
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Pagination } from "react-bootstrap"
const UserList = () => {
  const [modalShow, setModalShow] = useState(false)
  const [userSelected, setUserSelected] = useState(null)
  const userList = useSelector((store) => store.userList.userList)
  const [userSearch, setUserSearch] = useState([])
  const dispatch = useDispatch()
  const [inputSearch, setInputSearch] = useState('')
  //phan trang
  const [totalUsers, setTotalUsers] = useState(0)

  async function fetchData() {
    const users = await getUserAll()
    setUserSearch(users)
    setTotalUsers(users.length)
  }
  const [limit, setLimit] = useState(2)
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
  const handleDeleteConfirm = async (user) => {
    setModalShow(true)
    setUserSelected(user)
    // dispatch(getUsersList())
  }
  const handleDeleteUser = async () => {

    setModalShow(false)
    await deleteUserByID(userSelected.id)
    dispatch(getUsersList({ page: 1, limit }))

    setUserSelected(null)
  }

  useEffect(() => {
    dispatch(getUsersList({ page: 1, limit }))
    fetchData()

  }, [limit])
  return (
    <>
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
          <table>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Birthday</th>
              <th>Department</th>
              <th colSpan={2}>Action</th>
            </tr>
            {inputSearch !== '' && (
              userSearch.filter((user) => user.lastName.toLowerCase().includes(inputSearch.toLowerCase())
                || user.firstName.toLowerCase().includes(inputSearch.toLowerCase())).map((user, index) => (
                  <tr key={user.id}>
                    <td>{user?.id}</td>
                    <td>{user?.firstName}</td>
                    <td>{user?.lastName}</td>
                    <td>{user?.address}</td>
                    <td>{user?.birthday}</td>
                    <td>{user?.department}</td>
                    <td>
                      <Link className={`${classes.btn} ${classes.btn__edit}`} to={`/user/${user.id}`}>
                        Edit
                      </Link>
                    </td>
                    <td>
                      <button
                        className={`${classes.btn} ${classes.btn__delete}`}
                        onClick={() => {
                          handleDeleteConfirm(user);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )))
            }

            {inputSearch === '' && (userList?.map((user, index) => (
              <tr key={user.id}>
                <td>{user?.id}</td>
                <td>{user?.firstName}</td>
                <td>{user?.lastName}</td>
                <td>{user?.address}</td>
                <td>{user?.birthday}</td>
                <td>{user?.department}</td>
                <td>
                  <Link className={`${classes.btn} ${classes.btn__edit}`} to={`/user/${user.id}`}
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <button className={`${classes.btn} ${classes.btn__delete}`}
                    onClick={() => { handleDeleteConfirm(user) }}>
                    Delete
                  </button>
                </td>
              </tr>
            )))}

          </table>
          {inputSearch === '' && (
            <div className="d-flex justify-content-end align-item-center column-gap-2 mt-3 ">
              <div className="d-flex align-items-center column-gap-1">
                <label >Số user trên 1 page:</label>
                <select className={classes.select} value={limit} onChange={(e) => setLimit(e.target.value)}>
                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={totalUsers}>All</option>
                </select>
              </div>
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

          )}
        </div>
      </div>
      <Modal
        show={modalShow}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter">
            Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Are you sure you want to delete this user?</h6>

        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-transparent text-black border-black border-opacity-25"
            onClick={() => {
              setModalShow(false)
              setUserSelected(null)
            }}>Cancel</Button>
          <Button className={classes.btn__delete}
            onClick={() => { handleDeleteUser() }}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserList
