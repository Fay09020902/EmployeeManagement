import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../features/user';
import { CardContainer } from '../../common/QuantityControl'

import styled from '@emotion/styled';

const { Title } = Typography;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledForm = styled(Form)`
  width: 300px;
  .ant-form-item-label {
    color: #333;
  }
`;

const ResponsiveFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;

  @media (max-width: 960px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SignIn = () => {
  const { error, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values) => {
    dispatch(clearError());
    const { email, password } = values;
    await dispatch(loginUser({ email, password }));
  };

  const handleFieldChange = () => {
    if (error) dispatch(clearError());
  };

  return (
    <CardContainer>
      <AuthContainer>
        <Title level={3}>Sign In to Your Account</Title>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <StyledForm name="signin" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input onChange={handleFieldChange} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password onChange={handleFieldChange} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>

          <ResponsiveFooter>
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
            <p>
              <a href="/forget-password">Forgot Password?</a>
            </p>
          </ResponsiveFooter>
        </StyledForm>
      </AuthContainer>
    </CardContainer>
  );
};

export default SignIn;
