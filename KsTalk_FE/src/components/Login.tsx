import React, { useEffect } from "react";
import { Form, Input, Button, Message } from "@arco-design/web-react";
import { useNavigate, useLocation, useMatches } from "react-router-dom";
// import styles from "./styles/login.module.scss";
import axios from "axios";

const FormItem = Form.Item;
const Password = Input.Password;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches();

  useEffect(() => {
    console.log(location, "matches\\n", matches);
  }, []);
  return (
    <>
      {/**false && (
        <div className={styles.main}>
          <input type="checkbox" id="chk" aria-hidden="true" />
          <div className={styles.login}>
            <form className={styles.form}>
              <label htmlFor="chk" aria-hidden="true">
                KS登录
              </label>
              <input
                className={styles.input}
                type="number"
                name="loginNum"
                placeholder="请输入手机号📱"
                required
              />
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="请输入密码🌍"
                required
              />
              <button>登录😀</button>
            </form>
          </div>
          <div className={styles.register}>
            <form className={styles.form}>
              <label htmlFor="chk" aria-hidden="true">
                KS注册
              </label>
              <input
                className={styles.input}
                type="text"
                name="username"
                placeholder="请输入用户名🌐"
                required
              />
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="请输入邮箱📧"
                required
              />
              <input
                className={styles.input}
                type="number"
                name="phone"
                placeholder="请输入手机号📱"
                required
              />
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="请输入密码🌍"
                required
              />
              <button>注册😎</button>
            </form>
          </div>
        </div>
      )*/}
      <Form
        form={form}
        style={{
          width: 600,
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          border: "5px solid #ff33cc",
        }}>
        <FormItem
          label="手机:"
          field="loginNum"
          required
          rules={[
            // {
            //   validator(value, cb) {
            //     if (!value) {
            //       return cb("必须填写手机号!📱");
            //     } else if (/^1[3456789]\d{9}$/g.test(value)) return cb();
            //     else return cb("请输入正确的手机号");
            //   },
            // },
          ]}>
          <Input placeholder="请输入你的手机号📱/用户名🌐/邮箱📧" maxLength={11} allowClear/>
        </FormItem>
        <FormItem
          label="密码:"
          field="password"
          required
          rules={[
            {
              validator(value, cb) {
                if (!value) {
                  return cb("必须输入密码!🌍");
                }
                return cb();
              },
            },
          ]}>
          <Password placeholder="请输入密码🌍" allowClear/>
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button
            type="primary"
            onClick={async () => {
              try {
                await form.validate();
                axios({
                  method: "post",
                  url: "/api1/member/user/login",
                  data: form.getFieldsValue(),
                })
                  .then((res) => {
                    const infos  = res.data
                    localStorage.setItem("token", JSON.stringify(infos.data.token));
                    localStorage.setItem("refreshToken", JSON.stringify(infos.data.refreshToken));
                    localStorage.setItem("imUsers", JSON.stringify(infos.data));
                    Message.success("登陆成功");
                    navigate("/");
                  })
                  .catch((err) => {
                    Message.error(err);
                  });
              } catch (e) {
                Message.error("登录失败");
              }
            }}
            style={{ marginRight: 24 }}>
            登录😀
          </Button>
          <Button
            type="outline"
            onClick={() => {
              navigate("/regist");
              Message.info("欢迎注册~😀");
            }}
            style={{ marginRight: 24 }}>
            去注册
          </Button>
          <Button
            style={{ marginRight: 24 }}
            onClick={() => {
              form.resetFields();
            }}>
            清空
          </Button>
        </FormItem>
      </Form>
    </>
  );
};

export default Login;
