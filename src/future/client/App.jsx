import React from "react";
import { Layout, HeaderBar, Sidenav, SidenavHeader, SidenavItem, Page, OperationalUI } from "@operational/components";

const App = () => (
  <OperationalUI>
    <Layout
      header={<HeaderBar />}
      main={<Page title="My Page">Sup</Page>}
      sidenav={
        <Sidenav>
          <SidenavHeader active label="My Dogs">
            <SidenavItem label="Doge" />
          </SidenavHeader>
        </Sidenav>
      }
    />
  </OperationalUI>
);

export default App;
