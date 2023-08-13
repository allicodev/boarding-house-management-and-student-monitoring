import React, { useState } from "react";
import { Layout } from "antd";
import { VscGraph } from "react-icons/vsc";
import { IoIosPeople } from "react-icons/io";
import { FaHouseCircleCheck } from "react-icons/fa6";
import { Sider, Header, Content, Footer } from "../layout";

import Verification from "../components/admin/verification";
import Student from "../components/admin/student";
import Home from "../components/admin/home";

const MyApp = ({ app_key }) => {
  const [selectedKey, setSelectedKey] = useState("home");
  return (
    <>
      <Layout>
        <Sider
          selectedIndex={(e) => setSelectedKey(e.key)}
          selectedKey={selectedKey}
          image="/oss-logo.png"
          items={[
            { label: "Home", key: "home", icon: <VscGraph /> },
            {
              label: "Verification",
              key: "verification",
              icon: <FaHouseCircleCheck />,
            },
            { label: "Students", key: "student", icon: <IoIosPeople /> },
          ]}
        />
        <Layout>
          <Header app_key={app_key} />
          <Content selectedKey={selectedKey} setSelectedKey={setSelectedKey}>
            {selectedKey == "verification" ? <Verification /> : null}
            {selectedKey == "student" ? <Student /> : null}
            {selectedKey == "home" ? <Home /> : null}
          </Content>
        </Layout>
      </Layout>
      {/* <Footer /> */}
    </>
  );
};

export async function getServerSideProps() {
  return { props: { app_key: process.env.FILESTACK_KEY } };
}

export default MyApp;
