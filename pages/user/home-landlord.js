import React, { useState } from "react";
import { Layout } from "antd";
import { Sider, Header, Content, Footer } from "../layout";
import { FcBullish } from "react-icons/fc";

import Home from "../components/landlord/home";

const MyApp = () => {
  const [selectedKey, setSelectedKey] = useState("home");
  return (
    <>
      <Layout>
        <Sider
          selectedIndex={(e) => setSelectedKey(e.key)}
          selectedKey={selectedKey}
          items={[{ label: "Home", key: "home", icon: <FcBullish /> }]}
        />
        <Layout>
          <Header />
          <Content selectedKey={selectedKey} setSelectedKey={setSelectedKey}>
            {selectedKey == "home" ? <Home /> : null}
          </Content>
        </Layout>
      </Layout>
      {/* <Footer /> */}
    </>
  );
};

export default MyApp;
