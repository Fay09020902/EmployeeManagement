import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from "react-redux";
import { CardContainer } from '../../common/QuantityControl'
import { makeHTTPPOSTRequest } from '../../services/api';
import {createUserAsync, clearError} from '../../features/user'

const { Title } = Typography;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #f7f7f7;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 300px;
`;

const RegisterWithToken = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [token, setToken] = useState('');
  const {error} = useSelector(state => state.user)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    console.log("token: ", t)
    if (!t) {
      message.error('Missing token in URL');
      return;
    }

    setToken(t);

      makeHTTPPOSTRequest('validate-token', {}, t)
      .then((data) => {
        if (data.email) {
          setEmail(data.email);
          setTokenValid(true);
        } else {
          message.error(data.message || 'Invalid or expired token');
        }
      })
      .catch(() => {
        message.error('Failed to validate token');
      });
  }, []);



  const onFinish = async (values) => {

    try {
      dispatch(clearError())
      const response = await dispatch(createUserAsync({ values, token }));
      const data = await response.json();
      if (response.ok) {
        message.success('Registration successful! You can now sign in.');
        navigate('/signin');
      } else {
        message.error(data.message || 'Registration failed');
      }
    } catch (err) {
      message.error('Something went wrong');
    }
  };

  if (!tokenValid) return null;

  return (
    <CardContainer>
      <RegisterContainer>
        <Title level={3}>Register Your Account</Title>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <StyledForm layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email">
            <Input value={email} disabled />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter a username' }]}
          >
            <Input placeholder="Choose a username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter a password' }]}
          >
            <Input.Password placeholder="Create a password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </StyledForm>
      </RegisterContainer>
    </CardContainer>
  );
};

export default RegisterWithToken;
