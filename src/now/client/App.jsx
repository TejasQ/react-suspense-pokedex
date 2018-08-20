import React, { Component } from "react";
import OperationalUI, { Layout, HeaderBar, Sidenav, SidenavHeader, Page } from "@operational/components";

import DogList from "./DogList";
import DogImage from "./DogImage";

class App extends Component {
  state = {};

  setBreed = breed => this.setState({ breed });

  render() {
    return (
      <OperationalUI>
        <Layout
          header={<HeaderBar />}
          main={<Page title="My Page">{this.state.breed && <DogImage breed={this.state.breed} />}</Page>}
          sidenav={
            <Sidenav>
              <SidenavHeader active label="My Dogs">
                <DogList onChooseBreed={this.setBreed} />
              </SidenavHeader>
            </Sidenav>
          }
        />
      </OperationalUI>
    );
  }
}

export default App;
