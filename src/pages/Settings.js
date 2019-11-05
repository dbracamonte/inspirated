import React from "react";
import Layout from "../components/layout";
import Settings from "../containers/settings";

class SettingsPage extends React.Component {

  render() {

    return (
      <Layout title="Configuraciones">
        <Settings />
      </Layout>
    );
  }
}

export default SettingsPage;
