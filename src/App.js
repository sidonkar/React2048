import React, {Component} from 'react';
import './App.css';
import {GameContainer} from "./GameContainer";
import * as Constants from './constants';
class App extends Component {
    constructor(props) {
        super(props);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.state = {currentKey:"123"};
    }
  render() {
    return (
      <div className="App" onKeyDown={this.handleKeyPress} tabIndex="1">
          <div className="App-header">
              <h2>Welcome to React based 2048</h2>
          </div>
          <GameContainer keyPressed={this.state.currentKey} onKeyPressed={()=>this.setState({currentKey:'ignore'})}></GameContainer>
      </div>
    );
  }

    handleKeyPress(event) {
        let key= event.keyCode;
        switch (event.keyCode) {
            case Constants.LEFT_ID:
                // alert("Left");
                break;
            case Constants.TOP_ID:
                // alert("Top");
                break;
            case Constants.RIGHT_ID:
                // alert("Right");
                break;
            case Constants.DOWN_ID:
                // alert("Down");
                break;
            default:key=null;break;
        }
         this.setState({currentKey:key+""});
    }



}

export default App;
