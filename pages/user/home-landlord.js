import React, { useState } from "react";
import { Layout } from "antd";
import { Sider, Header, Content, Footer } from "../layout";
import { BsFillHouseFill } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { IoIosPeople } from "react-icons/io";

import Home from "../components/landlord/home";
import Establishment from "../components/landlord/establishment";
import Tenants from "../components/landlord/tenants";

const MyApp = ({ app_key }) => {
  const [selectedKey, setSelectedKey] = useState("home");

  return (
    <>
      <Layout>
        <Sider
          selectedIndex={(e) => setSelectedKey(e.key)}
          selectedKey={selectedKey}
          items={[
            { label: "Dashboard", key: "home", icon: <VscGraph /> },
            {
              label: "Accommodation",
              key: "accommodation",
              icon: <BsFillHouseFill />,
            },
            {
              label: "Tenants",
              key: "tenants",
              icon: <IoIosPeople />,
            },
          ]}
        />
        <Layout>
          <Header app_key={app_key} />
          <Content selectedKey={selectedKey} setSelectedKey={setSelectedKey}>
            {selectedKey == "home" ? <Home /> : null}
            {selectedKey == "accommodation" ? (
              <Establishment app_key={app_key} />
            ) : null}
            {selectedKey == "tenants" ? <Tenants /> : null}
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
