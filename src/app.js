import React from "react";

import Header from "./components/header/header.js";
import Footer from "./components/footer/footer.js";
import Random from "./components/random/random.js";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Random />
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
