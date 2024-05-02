import { useState, useEffect, useRef, ChangeEvent } from "react";
import "./index.scss";

const Chat: React.FC = () => {
  const [ws, setWs] = useState<any>(null);
  const urlRef = useRef("ws://109.206.247.99:8224");
  const [msg, setMsg] = useState({
    nickname: "a",
    code: 10002,
    content: "null",
    target: "bb",
    type: 1,
  });
  useEffect(() => {
    const ws = new WebSocket(urlRef.current);
    setWs(ws);
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setMsg({ ...msg, content: e.target.value });
  };
  const connectWebSocket = () => {
    ws.send(JSON.stringify(msg));
    console.log("send successful");

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
//   const disconnectWebSocket = () => {
//     if (ws) {
//       ws.close();
//       console.log("WebSocket 主动关闭");
//     }
//   };
  return (
    <>
      <div className="wrapper">
        <div className="container">
          <div className="left">
            <div className="top">
              <input type="text" placeholder="Search" />
              <a className="search"></a>
            </div>
            <ul className="people">
              <li className="person" data-chat="person2">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/dog.png"
                  alt=""
                />
                <span className="name">Dog Woofson</span>
                <span className="time">1:44 PM</span>
                <span className="preview">
                  I've forgotten how it felt before
                </span>
              </li>
              <li className="person" data-chat="person3">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/382994/louis-ck.jpeg"
                  alt=""
                />
                <span className="name">Louis CK</span>
                <span className="time">2:09 PM</span>
                <span className="preview">
                  But we’re probably gonna need a new carpet.
                </span>
              </li>
            </ul>
          </div>
          <div className="right">
            <div className="top">
              <span>
                To: <span className="name">Dog Woofson</span>
              </span>
            </div>
            <div className="chat" data-chat="person2">
              <div className="conversation-start">
                <span>Today, 5:38 PM</span>
              </div>
              <div className="bubble you">Hello, can you hear me?</div>
              <div className="bubble you">I'm in California dreaming</div>
              <div className="bubble me">... about who we used to be.</div>
              <div className="bubble me">Are you serious?</div>
              <div className="bubble you">When we were younger and free...</div>
              <div className="bubble you">
                I've forgotten how it felt before
              </div>
            </div>
            <div className="write">
              <a className="write-link attach"></a>
              <input type="text" onChange={handleChange} />
              <a className="write-link smiley"></a>
              <a className="write-link send" onClick={connectWebSocket}></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
