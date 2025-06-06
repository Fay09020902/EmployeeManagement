import { Tabs } from "antd";
// import EmployeeProfiles from "./EmployeeProfiles";
// import VisaStatusManagement from "./VisaStatusManagement";
import HiringManagement from "./HiringManagement";

const { TabPane } = Tabs;

const HRDashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>HR Dashboard</h1>
      <Tabs defaultActiveKey="1">
        {/* <TabPane tab="Employee Profiles" key="1">
          <EmployeeProfiles />
        </TabPane>
        <TabPane tab="Visa Status Management" key="2">
          <VisaStatusManagement />
        </TabPane> */}
        <TabPane tab="Hiring Management" key="3">
          <HiringManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HRDashboard;
