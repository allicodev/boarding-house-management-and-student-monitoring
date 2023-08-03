import React, { useState } from "react";
import { Layout } from "antd";
import { Sider, Header, Content, Footer } from "../layout";
import { FcBullish } from "react-icons/fc";
import Cookies from "js-cookie";
import Home from "../components/student/home";
import Requests from "../components/student/requests";

const currentUser = JSON.parse(Cookies.get("currentUser") ?? "{}");

const MyApp = () => {
  const [selectedKey, setSelectedKey] = useState("home");

  let items = [
    {
      label: "Home",
      key: "home",
      icon: <FcBullish />,
    },
  ];

  if (Object.keys(currentUser).length != 0)
    items.push({
      label: "Requests",
      key: "requests",
      icon: <FcBullish />,
    });

  return (
    <>
      <Layout>
        <Sider
          selectedIndex={(e) => setSelectedKey(e.key)}
          selectedKey={selectedKey}
          items={items}
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
