import React from "react";
import {
  DateRangePicker,
  DateRange,
} from "@matharumanpreet00/react-daterange-picker";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      dateRange: {},
    };
  }

  render() {
    return (
      <DateRangePicker
        open={this.state.open}
        onChange={(range) => this.setState({ dateRange: range })}
      />
    );
  }
}

export default App;
