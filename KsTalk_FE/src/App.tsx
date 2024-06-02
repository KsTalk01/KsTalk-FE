import { useRef, useEffect } from "react";
import styles from "./App.module.scss";
import Chat from "./components/Chat";
import { Button } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";

const App: React.FC = () => {
  const isLogin = useRef<boolean>(false);
  const navigate = useNavigate();
  const source = useRef<EventSource>();
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
  };
  const disconnectSSE = () => {
    source.current?.close();
  };

  const loginOut = () => {
    localStorage.removeItem("imUsers");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  useEffect(() => {
    isLogin.current = !!localStorage.getItem("imUsers");
    if (!isLogin.current) {
      navigate("/login");
    }
  }, [isLogin.current]);

  return (
    <>
      <div className={styles.home}>Hello KsTalk</div>

      <Button onClick={connectSSE} type="outline">
        SSE链接
      </Button>
      <Button onClick={disconnectSSE} type="outline">
        SSE断开
      </Button>
      <Button onClick={loginOut} type="outline">
        退出登录
      </Button>
      <Chat />
    </>
  );
};

export default App;
