import { useState, useRef } from "react";
import styles from "./App.module.scss";
import Chat from "./components/Chat";
const url = "ws://109.206.247.99:8224"; // WebSocket服务器地址
const a = `{ "nickname": "a",\n "code": 10002,\n "content": "你好 我是tiexi",\n "target": "bb",\n "type": 1 }`;
import { Button, Message } from "@arco-design/web-react";
import axios from "axios";

const App: React.FC = () => {
  const [ws, setWs] = useState<any>();
  const source = useRef<EventSource>()
  const connectWebSocket = () => {
    const ws = new WebSocket(url);
    setWs(ws);
    ws.onopen = () => {
      ws.send(a);
      console.log("刚建立就发一条 send successful");
    };

    ws.onmessage = (event: any) => {
      console.log("Message from server: " + event.data);
    };

    ws.onclose = (event: any) => {
      console.log("WebSocket disconnected", event);
    };

    ws.onerror = (event: any) => {
      console.error("WebSocket error", event);
    };
  };
  const disconnectWebSocket = () => {
    if (ws) {
      ws.close();
      console.log("WebSocket 主动关闭");
    }
  };
  const checkUsers = () => {
    axios.post("/api1/user/user/info", {
      username: "zhangs",
    });
  };
  const addUsers = () => {
    axios.post(
      "/api1/user/friendsship/sendFriendReq",
      {
        lastUserId: "1787121357699596300",
      },
      {
        headers: {
          Authorization: `Bearer ${"6248b583-41f2-4822-ae72-bcad5f02ab69"}`,
        },
      }
    ).then((res: any) => {
      console.log(res)
    }).catch(err => {
      Message.error(err)
    })
  };
  const acceptUsers = () => {
    axios.post(
      "/api1/user/friendsship/addFriend",
      {
        firstUserId: "1791713272752271361",
      },
      {
        headers: {
          Authorization: `Bearer ${"6248b583-41f2-4822-ae72-bcad5f02ab69"}`,
        },
      }
    ).then((res: any) => {
      console.log(res)
    }).catch(err => {
      Message.error(err)
    })
  };
  const connectSSE = () => {
    if (!!window.EventSource) {
      source.current = new EventSource("/api2/sse/connect/1791713272752271361");
    } else {
      throw new Error("当前浏览器不支持SSE");
    }
    //对于建立链接的监听
    source.current.onopen = () => {
      console.log(source.current?.readyState);
      console.log("长连接打开");
    };

    //对服务端消息的监听
    source.current.onmessage = (event) => {
      console.log(JSON.parse(event.data));
    };

    //对断开链接的监听
    source.current.onerror = () => {
      console.log(source.current?.readyState);
      console.log("长连接中断");
    };
  }
  const connectSSE2 = () => {
    if (!!window.EventSource) {
      source.current = new EventSource("/api2/sse/connect/1787121357699596289");
    } else {
      throw new Error("当前浏览器不支持SSE");
    }
    //对于建立链接的监听
    source.current.onopen = () => {
      console.log(source.current?.readyState);
      console.log("长连接打开");
    };

    //对服务端消息的监听
    source.current.onmessage = (event) => {
      console.log(JSON.parse(event.data));
    };

    //对断开链接的监听
    source.current.onerror = () => {
      console.log(source.current?.readyState);
      console.log("长连接中断");
    };
  }
  const disconnectSSE = () => {
    source.current?.close();
  }
  return (
    <>
      <div className={styles.home}>Hello KsTalk</div>
      <button onClick={connectWebSocket}>ws连接</button>
      <button onClick={disconnectWebSocket} className={styles.home}>
        ws断开
      </button>
      <Button onClick={checkUsers}>查询用户信息</Button>
      <Button onClick={addUsers} type='primary'>添加好友</Button>
      <Button onClick={acceptUsers} type='outline'>接受好友请求</Button>
      <Button onClick={connectSSE} type='outline'>SSE链接</Button>
      <Button onClick={connectSSE2} type='outline'>SSE链接2</Button>
      <Button onClick={disconnectSSE} type='outline'>SSE断开</Button>
      <Chat />
    </>
  );
};

export default App;
