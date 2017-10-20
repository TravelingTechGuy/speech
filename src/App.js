import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {speechAvailable: !!window.speechSynthesis, voices: []};
    this._speak = this.speak.bind(this);
    this._translate = this.translate.bind(this);
    //populate voices list, after document loaded
    window.speechSynthesis.onvoiceschanged = function() {
      this.setState({voices: window.speechSynthesis.getVoices()});
    }.bind(this);
  }

  form() {
    if(this.state.speechAvailable) {
      return (
        <div>
          <label htmlFor="message">Message:</label>
          &nbsp;
          <input type="text" id="message" defaultValue="hello world" />
          &nbsp;
          <label htmlFor="voice">Choose voice/language:</label>
          &nbsp;
          <select id="voice" onChange={this._translate}>
          {
            this.state.voices.map((voice, i) => <option key={i} value={i}>{voice.name} ({voice.lang})</option>)
          }
          </select>
          &nbsp;
          <button onClick={this._speak}>Speak</button>
        </div>
      );
    }
    else {
      return <span>Speech is not supported by this browser</span>;
    }
  }

  speak() {
    let msg = new SpeechSynthesisUtterance(document.getElementById('message').value);
    msg.voice = this.state.voices[document.getElementById('voice').value || 0];
    window.speechSynthesis.speak(msg);
  }

  async translate() {
    let textbox = document.getElementById('message');
    let language = this.state.voices[document.getElementById('voice').value].lang.substring(0, 2);
    let msg = encodeURI(textbox.value);
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${msg}`;
    try {
      let response = await fetch(url);
      let json = await response.json();
      textbox.value = json[0][0][0];
      this.speak();
    }
    catch(err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Speech Demonstration</h1>
        </header>
        <p/>
        <div className="App-intro">{this.form()}</div>
      </div>
    );
  }
}

export default App;
