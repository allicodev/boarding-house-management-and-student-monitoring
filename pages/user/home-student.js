import React, { useState } from "react";
import { Layout } from "antd";
import { Sider, Header, Content, Footer } from "../layout";
import { FcBullish } from "react-icons/fc";
import Home from "../components/student/home";
import Requests from "../components/student/requests";

const MyApp = () => {
  const [selectedKey, setSelectedKey] = useState("home");
  return (
    <>
      <Layout>
        <Sider
          selectedIndex={(e) => setSelectedKey(e.key)}
          selectedKey={selectedKey}
          items={[
            {
              label: "Home",
              key: "home",
              icon: <FcBullish />,
            },
            {
              label: "Requests",
              key: "requests",
              icon: <FcBullish />,
            },
          ]}
        />
        <Layout>
          <Header />
          <Content selectedKey={selectedKey}>
            {selectedKey == "home" ? <Home /> : null}
            {selectedKey == "requests" ? <Requests /> : null}
          </Content>
        </Layout>
      </Layout>
      {/* <Footer /> */}
    </>
  );
};

export default MyApp;
