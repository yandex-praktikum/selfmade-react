import React from './react';

export default class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    }
  }

  componentDidMount() {
    console.log('Я примонтировался');
  }

  render() {
    return (
      <div>
        <p>Счет: {this.state.count}</p>
        <button onClick={() => this.setState({
          count: this.state.count + 1
        })}>Increment</button>
      </div>
    )
  }
}
