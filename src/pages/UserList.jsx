import { Button, Input } from 'antd'
import React from 'react'
const { Search } = Input;

export const UserList = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  return (
    <div>
      <Button type='primary'>Create new User</Button>
      <Search placeholder="input search text" onSearch={onSearch} enterButton />
      <Table />
    </div>
  )
}
