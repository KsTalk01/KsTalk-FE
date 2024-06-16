import { List, Avatar, Message } from "@arco-design/web-react";
import "./styles/newFriends.module.scss";
import { useEffect, useState } from "react";
import axios from 'axios'

type Props = {
  list?: any;
};

export default function NewFriends({ list }: Props) {
  debugger
  const [friList, setFriList] = useState(list)

  useEffect(()=>{
    setFriList(list)
  }, [list])

  /**
   * @description 接受好友请求
   */
  const acceptUsers = (id: string) => {
    axios
      .post(
        "/api1/member/friendsship/addFriend",
        {
          firstUserId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")!
            )}`,
          },
        }
      )
      .then(() => {
        Message.success('添加好友成功')
      })
      .catch((err) => {
        Message.error(err);
      });
  };

  const acceptUser = (id: string) => {
    acceptUsers(id);
    deleteUser(id)
  };

  const deleteUser = (id: string) => {
    const updatedUsers = friList.filter((user:any) => user.id!== id);
    setFriList(updatedUsers);
    Message.warning('删除成功')
  };
  return (
    friList.length > 0 && (
    <List
      className="list-demo-actions"
      style={{ width: 400, color: "#fff" }}
      dataSource={friList}
      render={(item, index) => (
        <List.Item key={index}>
          <List.Item.Meta
            avatar={
              <Avatar shape="square" style={{ backgroundColor: "#FF7D00" }}>
                {item.username.charAt(0).toUpperCase()}
              </Avatar>
            }
            title={item.username}
            description={item.signature || "这个人很懒，什么都没有留下"}
          />
          <div style={{display:'flex',justifyContent:'flex-end', cursor:'pointer'}}>
            <div className='list-demo-actions-button' onClick={() => acceptUser(item.id)}>接受</div>
            <div className='list-demo-actions-button' onClick={() => deleteUser(item.id)} style={{marginLeft: 10}}>删除</div>
          </div>
        </List.Item>
      )}
    />)
  );
}
