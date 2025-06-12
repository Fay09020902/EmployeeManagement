import React, { useEffect } from 'react';
import { Table, Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const statusColor = {
  'Approved': 'green',
  'Pending': 'orange',
  'Rejected': 'red',
  'Not Submitted': 'default',
};

const columns = [
  { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Work Auth', dataIndex: 'workAuth', key: 'workAuth' },
  {
    title: 'OPT Receipt',
    dataIndex: 'optReceiptStatus',
    key: 'optReceiptStatus',
    render: (text) => <Tag color={statusColor[text] || 'default'}>{text}</Tag>,
  },
  {
    title: 'OPT EAD',
    dataIndex: 'optEADStatus',
    key: 'optEADStatus',
    render: (text) => <Tag color={statusColor[text] || 'default'}>{text}</Tag>,
  },
  {
    title: 'I-983',
    dataIndex: 'i983Status',
    key: 'i983Status',
    render: (text) => <Tag color={statusColor[text] || 'default'}>{text}</Tag>,
  },
  {
    title: 'I-20',
    dataIndex: 'i20Status',
    key: 'i20Status',
    render: (text) => <Tag color={statusColor[text] || 'default'}>{text}</Tag>,
  },
  { title: 'Next Step', dataIndex: 'nextStep', key: 'nextStep' },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Button
        size="small"
        onClick={() => record.navigate(`/hr/visa/${record.userId}`)}
      >
        Review
      </Button>
    ),
  },
];

export default function VisaStatusManagement() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/hr/visa-status/all', { credentials: 'include' })
      .then((res) => res.json())
      .then((arr) => {
        setData(arr.map(item => ({ ...item, navigate })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Visa Status Management</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="userId" />
      )}
    </div>
  );
}
