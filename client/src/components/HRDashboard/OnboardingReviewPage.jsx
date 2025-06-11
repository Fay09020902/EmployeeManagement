import React, { useEffect, useState } from 'react';
import { Typography, Button, Input, Form, Collapse, Spin } from 'antd';
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
import { useDispatch, useSelector } from 'react-redux';
import {setApplications} from '../../features/onboarding'
const { TextArea } = Input;


const OnboardingReviewPage = () => {
//   const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const { applications, loading, error } = useSelector((state) => state.onboarding);

  const [feedback, setFeedback] = useState('');
  const dispatch = useDispatch();

//   console.log("reredender happens")
//   console.log(applications)

  const fetchApplications = async (status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/hr/hiring/applications/${status}`);
      const data = await res.json();
      dispatch(setApplications(data))
    } catch (err) {
      message.error('Failed to fetch applications');
    }
  };

    useEffect(() => {
    fetchApplications(activeTab);
  }, []);



if (loading) return <Spin style={{ marginTop: '40px' }} />;
  if (!applications) return <div>Applications not found</div>;

  const { fullName, email, status, profile } = applications;

    return (
        <div style={{ padding: 40, maxWidth: 700, margin: 'auto' }}>
      <Title level={2}>View Application</Title>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Basic Info" key="1">
          <Paragraph><b>Full Name:</b> {fullName}</Paragraph>
          <Paragraph><b>Email:</b> {email}</Paragraph>
        </Panel>
        <Panel header="Personal Info" key="2">
          <Paragraph><b>SSN:</b> {profile?.ssn}</Paragraph>
          <Paragraph><b>DOB:</b> {profile?.dob?.slice(0, 10)}</Paragraph>
          <Paragraph><b>Gender:</b> {profile?.gender}</Paragraph>
        </Panel>
        <Panel header="Visa Info" key="3">
          <Paragraph><b>Work Auth:</b> {profile?.visa?.visaType}</Paragraph>
          <Paragraph><b>Start:</b> {profile?.visa?.startDate?.slice(0, 10)}</Paragraph>
          <Paragraph><b>End:</b> {profile?.visa?.endDate?.slice(0, 10)}</Paragraph>
        </Panel>
      </Collapse>
      </div>
    )
}
export default OnboardingReviewPage;
