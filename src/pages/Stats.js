import React from "react";
import Layout from "../components/layout";
import Stats from "../containers/Stats";

class StatsPage extends React.Component {

    render() {

        return (
            <Layout title="Estadísticas">
                <Stats />
            </Layout>
        );
    }
}

export default StatsPage;
