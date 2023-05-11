import React, { useState } from "react";
import { Layout } from "antd";
import { Sider, Header, Content, Footer } from "../layout";

const Home = () => {
  const [selectedKey, setSelectedKey] = useState("home");
  return (
    <>
      <Layout>
        <Sider
          selectedIndex={(e) => setSelectedKey(e.key)}
          selectedKey={selectedKey}
          items={[]}
        />
        <Layout>
          <Header />
          <Content selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
        </Layout>
      </Layout>
      {/* <Footer /> */}
    </>
  );
};

export default Home;
