import React from "react";
import Layout from "../components/layout";
import RateDay from "../containers/rateday";

class SettingsPage extends React.Component {
  render() {
    return (
      <Layout title="Setear Monto del día">
        <RateDay />
      </Layout>
    );
  }
}

export default SettingsPage;
