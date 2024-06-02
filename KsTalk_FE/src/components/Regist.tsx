import React from "react";
import { Form, Input, Button, Message } from "@arco-design/web-react";
import { useNavigate  } from "react-router-dom";
import axios from 'axios'
// import styles from "./styles/login.module.scss";

const FormItem = Form.Item;
const Password = Input.Password;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  return (
    <>
      <Form form={form} style={{ width: 600, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', border: '5px solid #ffcc33' }}>
        <FormItem
          label="昵称:"
          field="nickname"
          >
          <Input placeholder="请输入用户昵称🌐" allowClear />
        </FormItem>
        <FormItem
          label="用户名:"
          field="username"
          required
          rules={[
            {
              validator(value, cb) {
                if (!value) {
                  return cb("必须输入用户名!🌐");
                }
                return cb();
              },
            },
          ]}>
          <Input placeholder="请输入用户名🌐" allowClear />
        </FormItem>
        <FormItem
          label="邮箱:"
          field="email"
          required
          rules={[
            {
              validator(value, cb) {
                if (!value) {
                  return cb("必须入邮箱!📧");
                }
                return cb();
              },
            },
          ]}>
          <Input placeholder="请输入邮箱📧" allowClear />
        </FormItem>
        <FormItem
          label="手机:"
          field="phone"
          required
          rules={[
            {
              validator(value, cb) {
                if (!value) {
                  return cb("必须填写手机号!📱");
                } else if (/^1[3456789]\d{9}$/g.test(value)) return cb();
                else return cb("请输入正确的手机号");
              },
            },
          ]}>
          <Input placeholder="请输入你的手机号📱" maxLength={11} allowClear />
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
          <Password placeholder="请输入密码🌍" allowClear />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button
            type="primary"
            onClick={async () => {
              try {
                await form.validate();
                axios({
                  method: "post",
                  url: "/api1/member/user/regist",
                  data: form.getFieldsValue(),
                }).then((res) => {
                  console.log(res)
                  Message.success("注册成功,去登录吧");
                })
              } catch (e) {
                Message.error("注册失败");
              }
            }}
            style={{ marginRight: 24 }}>
            注册😎
          </Button>
          <Button
            type="outline"
            onClick={() => {
                navigate('/login')
                Message.info('欢迎登录~😀');
            }}
            style={{ marginRight: 24 }}>
            去登录
          </Button>
          <Button
            style={{ marginRight: 24 }}
            onClick={() => {
              form.resetFields();
            }}>
            重写
          </Button>
        </FormItem>
      </Form>
    </>
  );
};

export default Login;
