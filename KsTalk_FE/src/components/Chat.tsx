import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  ChangeEventHandler,
  // MouseEvent,
  // MouseEventHandler,
} from "react";
import { ChatDTO } from "../dto/chatDTO";
import "./styles/chat.scss";
import {
  Button,
  Message,
  Modal,
  Card,
  Skeleton,
  Avatar,
  Typography,
  Space,
} from "@arco-design/web-react";
import dayjs from "dayjs";
import axios from "axios";
import { myThrottle } from "@/utils";

const { Meta } = Card;

const Chat: React.FC = () => {
  const [ws, setWs] = useState<any>(null);
  const urlRef = useRef("ws://109.206.247.99:8224");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedInfos, setClickedInfos] = useState<any>({});
  const [rightVisibel, setRightVisibel] = useState<boolean>(false);
  const [visibleUserInfos, setVisibleUserInfos] = useState<boolean>(false);
  const [detailUserInfos, setDetailUserInfos] = useState<any>({});
  const [msg, setMsg] = useState<ChatDTO>({
    username: "null",
    code: 10002,
    content: "null",
    target: "",
    type: 1,
  });
  useEffect(() => {
    const ws = new WebSocket(urlRef.current);
    setWs(ws);
    //初始化获取好友列表
    getUsers();
  }, []);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setMsg({
      ...msg,
      content: e.target.value,
      username: JSON.parse(localStorage.getItem("imUsers")!).username,
      target: clickedInfos?.username,
    });
  };
  const connectWebSocket = () => {
    ws.send(JSON.stringify(msg));
  };
  //   const disconnectWebSocket = () => {
  //     if (ws) {
  //       ws.close();
  //       console.log("WebSocket 主动关闭");
  //     }
  //   };
  if (ws) {
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          ...msg,
          code: 10001,
          username: JSON.parse(localStorage.getItem("imUsers")!).username,
        })
      );
    };

    ws.onmessage = (event: MessageEvent) => {
      console.log("Message from server: " + event);
    };

    ws.onclose = (event: CloseEvent) => {
      console.log("WebSocket disconnected", event);
    };

    ws.onerror = (event: WebSocketEventMap["error"]) => {
      console.error("WebSocket error", event);
    };
  }

  /**
   * @description 获取好友列表
   */
  const getUsers = () => {
    axios
      .get("/api1/member/friendsship/list", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")!)}`,
        },
      })
      .then(({ data }) => {
        setList(data.data.friendsList);
      })
      .catch((err) => {
        Message.error(err);
      });
  };

  /**
   * @description 查询用户信息
   */
  const checkUsers = async (name: string) => {
    axios
      .post(
        "/api1/member/user/info",
        {
          username: name,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")!
            )}`,
          },
        }
      )
      .then(({ data }) => {
        if (data.data.length > 0) {
          setVisibleUserInfos(true);
          setDetailUserInfos(data.data[0]);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        } else Message.error("未找到~");
      })
      .catch((err) => {
        Message.error(err);
      });
  };

  /**
   * @description 添加好友
   * @returns cood 15005 好友请求已发送
   */
  const addUsers = (id: string) => {
    axios
      .post(
        "/api1/member/friendsship/sendFriendReq",
        {
          lastUserId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")!
            )}`,
          },
        }
      )
      .then(({ data }) => {
        data.msg === "success"
          ? Message.success(data.msg)
          : Message.error(data.msg);
      })
      .catch((err) => {
        Message.error(err);
      });
  };
  /**
   * @description 接受好友请求
   */
  const acceptUsers = () => {
    axios
      .post(
        "/api1/member/friendsship/addFriend",
        {
          firstUserId: "1791713272752271361",
        },
        {
          headers: {
            Authorization: `Bearer ${"6248b583-41f2-4822-ae72-bcad5f02ab69"}`,
          },
        }
      )
      .then((res: any) => {
        console.log(res);
      })
      .catch((err) => {
        Message.error(err);
      });
  };

  /**
   * @description 获取用户未读的所有消息
   */
  const getUnknownMsg = () => {
    axios
      .get("/api1/msg/chat/getUnread", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token")!)}`,
        },
      })
      .then(({ data }) => {
        console.log("未读消息", data.data);
      })
      .catch((err) => {
        Message.error(err);
      });
  };

  useEffect(() => {
    // 获取所有 <li> 元素
    const listItems = document.querySelectorAll("li");

    // 为每个 <li> 元素添加点击事件监听器
    listItems.forEach((item) => {
      item.addEventListener("click", selectUsers);
    });

    // 在组件卸载时,移除事件监听器
    return () => {
      listItems.forEach((item) => {
        item.removeEventListener("click", selectUsers);
      });
    };
  }, []);

  const selectUsers = async (e: any) => {
    const target = e.target as HTMLElement;
    let name = "";
    setRightVisibel(true);
    // 判断被点击的元素是什么,并获取名称
    if (target.classList.contains("name")) {
      name = target.textContent || "";
    } else {
      name =
        (target.parentElement as Element).querySelector(".name")?.textContent ||
        "";
    }
    const res = await axios
      .post(
        "/api1/member/user/info",
        {
          username: name,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")!
            )}`,
          },
        }
      )
      .catch((err) => {
        Message.error(err);
      });
    setClickedInfos(res!.data.data[0]);
    document
      .querySelector(".chat[data-chat=person2]")!
      .classList.add("active-chat");
    document
      .querySelector(".person[data-chat=person2]")!
      .classList.add("active");
  };

  const handleChangeToGetUsers: ChangeEventHandler<HTMLInputElement> =
    myThrottle(async (e: ChangeEvent<HTMLInputElement>) => {
      checkUsers(e.target.value);
    }, 2000);
  return (
    <>
      <div className="wrapper">
        <div className="container">
          <div className="left">
            <div className="top">
              <input
                type="text"
                placeholder="🪐搜索"
                onChange={handleChangeToGetUsers}
              />
              <a className="search"></a>
            </div>
            <ul className="people" onClick={selectUsers}>
              {list.length > 0 ? (
                list.map((item: any) => {
                  return (
                    <li className="person" data-chat="person2" key={item.id}>
                      <img
                        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/dog.png"
                        alt="img"
                        className="avatar"
                        // title='点击查看'
                      />
                      <span className="name">{item.username || "无名"}</span>
                      <span className="time">
                        {dayjs(item.lastLoginTime).format("HH:mm") ||
                          dayjs(new Date()).format("HH:mm")}
                      </span>
                      <span className="preview">
                        {item.signature || "这个人很懒，什么都没有留下"}
                      </span>
                    </li>
                  );
                })
              ) : (
                <span className="listNone">快去添加好友吧~</span>
              )}
            </ul>
          </div>
          {rightVisibel && (
            <div className="right">
              <div className="top">
                <span>
                  To: <span className="name">{clickedInfos?.username}</span>
                </span>
              </div>
              <div className="chat" data-chat="person2">
                <div className="conversation-start">
                  <span>{dayjs(new Date()).format("HH:mm")}</span>
                </div>
                <div className="bubble you">Hello, can you hear me?</div>
                <div className="bubble me">Are you serious?</div>
              </div>
              <div className="write">
                <a className="write-link attach"></a>
                <input type="text" onChange={handleChange} />
                <a className="write-link smiley"></a>
                <a className="write-link send" onClick={connectWebSocket}></a>
              </div>
            </div>
          )}
        </div>
      </div>
      <Button onClick={acceptUsers} type="outline">
        接受好友请求
      </Button>
      <Button onClick={getUnknownMsg} type="outline">
        获取未读信息
      </Button>
      <Modal
        title="用户详情"
        visible={visibleUserInfos}
        onOk={() => {
          setVisibleUserInfos(false);
          setLoading(true);
          setDetailUserInfos({});
          addUsers(detailUserInfos.id);
        }}
        okText="添加好友"
        cancelText="考虑一下"
        onCancel={() => {
          setVisibleUserInfos(false);
          setDetailUserInfos({});
          setLoading(true);
        }}
        autoFocus={false}
        focusLock={true}>
        {visibleUserInfos && (
          <Card
            style={{ width: 384 }}
            cover={
              <Skeleton
                loading={loading}
                text={{ rows: 0 }}
                image={{
                  style: {
                    width: 352,
                    height: 188,
                    margin: "16px 16px 0 16px",
                  },
                }}>
                <div style={{ height: 204, overflow: "hidden" }}>
                  <img
                    style={{ width: "100%", transform: "translateY(-20px)" }}
                    alt="dessert"
                    src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                  />
                </div>
              </Skeleton>
            }>
            {visibleUserInfos && (
              <Meta
                avatar={
                  <Skeleton
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                    loading={loading}
                    text={{ rows: 1, width: 64 }}
                    image={{
                      shape: "circle",
                      style: {
                        width: 24,
                        height: 24,
                      },
                    }}>
                    <Space>
                      <Avatar size={24}>
                        <img
                          alt="avatar"
                          src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                        />
                      </Avatar>
                      <Typography.Text>
                        {detailUserInfos?.username}
                      </Typography.Text>
                    </Space>
                  </Skeleton>
                }
                title={
                  <Skeleton
                    loading={loading}
                    style={{ marginTop: 0 }}
                    text={{
                      rows: 1,
                      width: 72,
                    }}>
                    {detailUserInfos?.username}
                  </Skeleton>
                }
                description={
                  <Skeleton loading={loading} text={{ rows: 1, width: 150 }}>
                    {detailUserInfos?.signature || "这个人很懒，什么都没有留下"}
                  </Skeleton>
                }
              />
            )}
          </Card>
        )}
      </Modal>
    </>
  );
};

export default Chat;
