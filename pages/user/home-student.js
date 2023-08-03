import React, { useState } from "react";
import { Layout } from "antd";
import { Sider, Header, Content, Footer } from "../layout";
import { BsFillHouseFill } from "react-icons/bs";
import { TbMessage2Question } from "react-icons/tb";

import Cookies from "js-cookie";
import Home from "../components/student/home";
import Requests from "../components/student/requests";

const currentUser = JSON.parse(Cookies.get("currentUser") ?? "{}");

const MyApp = ({ app_key }) => {
  const [selectedKey, setSelectedKey] = useState("home");

  let items = [
    {
      label: "Home",
      key: "home",
      icon: <BsFillHouseFill />,
    },
  ];

  if (Object.keys(currentUser).length != 0)
    items.push({
      label: "Requests",
      key: "requests",
      icon: <TbMessage2Question />,
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
          <Header app_key={app_key} />
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

export async function getServerSideProps() {
  return { props: { app_key: process.env.FILESTACK_KEY } };
}

export default MyApp;
