import { Button, Input, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteManyUser, getUserAll, getUsersList } from "../redux/userSlice";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Search } = Input;

const UserList = () => {
  const navigate = useNavigate();
  const userList = useSelector((store) => store.userList.userList);
  const total = useSelector((store) => store.userList.total);
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onSearch = (value) => {
    dispatch(getUsersList({ page: 1, limit, nameSearch: value }));
  };

  const handleConfirmDeleteUser = async (idList) => {
    const list = await deleteManyUser(idList);
    Promise.all(list).then(() => {
      dispatch(getUsersList({ page, limit }));
      dispatch(getUserAll());
      toast.success("Xóa thành công!");
      setSelectedRowKeys([]);
    });
  };

  const renderAction = (_, record) => {
    return (
      <div className="d-flex gap-1">
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/user/${record.id}`)}
        >
          Edit
        </Button>
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => handleConfirmDeleteUser([record.id])}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      </div>
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      withd: 120,
    },
    {
      title: "First Name",
      sortDirections: ["ascend", "descend"],
      dataIndex: "firstName",
      withd: 150,

      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sortDirections: ["descend", "ascend"],
      withd: 150,
      fixed: "left",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Address",
      dataIndex: "address",
      withd: 250,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Birthday",
      withd: 150,
      dataIndex: "birthday",
      sorter: (a, b) => new Date(a.birthday) - new Date(b.birthday),
    },
    {
      title: "Department",
      withd: 200,
      dataIndex: "department",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      withd: 250,
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  useEffect(() => {
    dispatch(getUsersList({ page, limit }));
    dispatch(getUserAll());
  }, []);

  const onPaginationChange = (page, pageSize) => {
    setPage(page);
    setLimit(pageSize);
    dispatch(getUsersList({ page, limit: pageSize }));
  };

  return (
    <div>
      <Space>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => navigate("/user/create")}
        >
          Create new User
        </Button>
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleConfirmDeleteUser(selectedRowKeys)}
          disabled={selectedRowKeys.length === 0}
        >
          Delete Many
        </Button>
      </Space>
      <Table
        bordered
        columns={columns}
        dataSource={userList}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          total,
          showSizeChanger: true,
          current: page,
          pageSize: limit,
          onChange: onPaginationChange,
          pageSizeOptions: [5, 10, 15],
          showTotal: (total) => `Total ${total} items`,
        }}
      />
    </div>
  );
};

export default UserList;
