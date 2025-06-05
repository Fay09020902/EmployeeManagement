import { useParams } from "react-router-dom";
import { CardContainer } from "../../common/QuantityControl";
import { Form, Input, Button, Card } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    // localStorage.setItem('token', token);
    const [userId, setUserId] = useState(null);
    //when submit, update thun will update person's pasword to new passowrd
    try {
        const decoded = jwtDecode(token);
        if (!decoded?.user?.id) throw new Error("Invalid token");
        setUserId(decoded.user.id);
      } catch (e) {
        message.error("Invalid or expired link.");
        navigate("/");
      }

    return (
        <CardContainer>
        <Card style={{ width: '100%', maxWidth: 500, margin: "0 auto" }}>
          <h2>Update Password</h2>
          <Form layout="vertical">
            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, message: "Please input your new password" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
        </CardContainer>
      );
}


export default UpdatePassword;
