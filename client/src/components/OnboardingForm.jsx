import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Button, Typography, DatePicker, Checkbox, Card, Upload, message } from 'antd';
import styled from '@emotion/styled';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const SubInput = styled.div`
  margin-left: 2rem;
  padding: 1rem 0;
`;

const OnboardingForm = () => {
  const [form] = Form.useForm();
  const [isCitizen, setIsCitizen] = useState(null);
  const [visaType, setVisaType] = useState('');
  const [optReceipt, setOptReceipt] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [err, setErr] = useState(null);
  const currentUser = useSelector(state => state.user.currentUser)
  const user = useSelector(state => state.user);
console.log("Redux user state:", user);

  const email = currentUser?.email;
  console.log(email)

  const onFinish = async (values) => {
    if (!profilePicture) {
      message.error('Please upload a profile picture.');
      return;
    }
    if (visaType === 'F1(CPT/OPT)' && !optReceipt) {
      message.error('Please upload OPT Receipt before submitting.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('formValues', JSON.stringify(values));
      formData.append('profilePicture', profilePicture);
      if (optReceipt) formData.append('optReceipt', optReceipt);

      const res = await fetch('http://localhost:5000/api/employee/profile', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const { message: errMsg } = await res.json();
        throw new Error(errMsg || 'Failed to submit onboarding form.');
      }

      message.success('Onboarding form submitted successfully.');
    } catch (err) {
      setErr(err);
      message.error(err.message || 'Submission failed.');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Title level={4}>Basic Info</Title>
      <Form.Item label="Upload Profile Picture (URL)" required>
    <Input
        value={profilePicture}
        onChange={(e) => setProfilePicture(e.target.value)}
        placeholder="Enter image URL"
    />
    </Form.Item>
      <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="middleName" label="Middle Name"><Input /></Form.Item>
      <Form.Item name="preferredName" label="Preferred Name"><Input /></Form.Item>

      <Title level={4}>Address</Title>
      <Form.Item name={["address", "building"]} label="Building" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name={["address", "street"]} label="Street" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name={["address", "city"]} label="City" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name={["address", "state"]} label="State" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name={["address", "zip"]} label="ZIP" rules={[{ required: true }]}><Input /></Form.Item>

      <Title level={4}>Contact</Title>
      <Form.Item name={["contact", "cellPhone"]} label="Cell Phone" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name={["contact", "workPhone"]} label="Work Phone"><Input /></Form.Item>
      <Form.Item label="Email"><Input value={email} disabled /></Form.Item>

      <Title level={4}>Personal</Title>
      <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
      <Form.Item name="gender" label="Gender" rules={[{ required: true }]}> <Select> <Option value="male">Male</Option> <Option value="female">Female</Option> <Option value="prefer not to say">Prefer not to say</Option> </Select> </Form.Item>
      <Form.Item name="ssn" label="SSN" rules={[{ required: true }]}><Input /></Form.Item>

      <Title level={4}>Visa</Title>
      <Form.Item label="Permanent resident or citizen of the U.S.?" required>
        <Select value={isCitizen} onChange={(value) => {
          const isYes = value === 'yes';
          setIsCitizen(value);
          form.setFieldsValue({ visa: { isCitizenOrResident: isYes } });
        }} allowClear>
          <Option value="yes">Yes</Option>
          <Option value="no">No</Option>
        </Select>
      </Form.Item>

      {isCitizen === 'yes' ? (
        <SubInput>
          <Form.Item name={["visa", "citizenType"]} label="Citizen Type">
            <Checkbox.Group>
              <Checkbox value="Green Card">Green Card</Checkbox>
              <Checkbox value="Citizen">Citizen</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </SubInput>
      ) : isCitizen === 'no' ? (
        <SubInput>
          <Form.Item name={["visa", "visaType"]} label="What is your work authorization?">
            <Select value={visaType || undefined} onChange={(value) => setVisaType(value)} allowClear>
              <Option value="H1-B">H1-B</Option>
              <Option value="L2">L2</Option>
              <Option value="F1(CPT/OPT)">F1(CPT/OPT)</Option>
              <Option value="H4">H4</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          {visaType === 'F1(CPT/OPT)' && (
            <Form.Item label="Upload OPT Receipt">
              <Upload beforeUpload={(file) => { setOptReceipt(file); return false; }} maxCount={1}> <Button icon={<UploadOutlined />}>Upload</Button> </Upload>
            </Form.Item>
          )}

          {visaType === 'Other' && (
            <Form.Item name={["visa", "otherVisaTitle"]} label="Other Visa Title"><Input /></Form.Item>
          )}

          <Form.Item name={["visa", "startDate"]} label="Start Date"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name={["visa", "endDate"]} label="End Date"><DatePicker style={{ width: '100%' }} /></Form.Item>
        </SubInput>
      ) : null}

      <Title level={4}>Reference (Who referred you?)</Title>
      <Form.Item name={["reference", "firstName"]} label="First Name" required><Input /></Form.Item>
      <Form.Item name={["reference", "lastName"]} label="Last Name" required><Input /></Form.Item>
      <Form.Item name={["reference", "middleName"]} label="Middle Name"><Input /></Form.Item>
      <Form.Item name={["reference", "phone"]} label="Phone"><Input /></Form.Item>
      <Form.Item name={["reference", "email"]} label="Email"><Input /></Form.Item>
      <Form.Item name={["reference", "relationship"]} label="Relationship" required><Input /></Form.Item>

      <Title level={4}>Emergency Contact(s)</Title>
      <Form.List name="emergencyContacts">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card key={key} style={{ marginBottom: '1rem' }}>
                <Form.Item {...restField} name={[name, 'firstName']} label="First Name" required><Input /></Form.Item>
                <Form.Item {...restField} name={[name, 'lastName']} label="Last Name" required><Input /></Form.Item>
                <Form.Item {...restField} name={[name, 'middleName']} label="Middle Name"><Input /></Form.Item>
                <Form.Item {...restField} name={[name, 'phone']} label="Phone"><Input /></Form.Item>
                <Form.Item {...restField} name={[name, 'email']} label="Email"><Input /></Form.Item>
                <Form.Item {...restField} name={[name, 'relationship']} label="Relationship" required><Input /></Form.Item>
                <Button danger onClick={() => remove(name)}>Remove</Button>
              </Card>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>Add Emergency Contact</Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Title level={4}>Summary of Uploaded Files</Title>
      <ul>
        <li><strong>Profile Picture:</strong> {profilePicture ? profilePicture: 'Not uploaded'}</li>
        <li><strong>OPT Receipt:</strong> {optReceipt?.name || 'Not uploaded'}</li>
      </ul>

      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default OnboardingForm;
