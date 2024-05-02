import { useState } from "react";
import styles from "./App.module.scss";
import Chat from "./components/Chat";
const url = "ws://109.206.247.99:8224"; // WebSocket服务器地址
const a = `{ "nickname": "a",\n "code": 10001,\n "content": "你好 我是tiexi",\n "target": "bb",\n "type": 1 }`;
const App: React.FC = () => {
  const [ws, setWs] = useState<any>();
  const connectWebSocket = () => {
    const ws = new WebSocket(url);
    setWs(ws);
    ws.onopen = () => {
      ws.send(a);
      console.log('send successful')
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
  return (
    <>
      <div className={styles.home}>Hello KsTalk</div>
      <button onClick={connectWebSocket}>连接</button>
      <button onClick={disconnectWebSocket} className={styles.home}>
        断开
      </button>
      <Chat />
    </>
  );
};

export default App;
