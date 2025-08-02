import React from "react";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import PageTitle from "../../components/PageTitle";
import TheatresList from "./TheatresList";
import Bookings from "./Bookings";

function Profile() {
  const { user } = useSelector((state) => state.users);
  const isOwner = user?.isOwner === true; // adjust to your actual role field

  return (
    <div>
      <PageTitle title="Profile" />

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Bookings" key="1">
          <Bookings />
        </Tabs.TabPane>

        {isOwner && (
          <Tabs.TabPane tab="Theatres" key="2">
            <TheatresList />
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
}

export default Profile;
