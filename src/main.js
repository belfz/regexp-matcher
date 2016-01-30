import React from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rx';

function createKeyUpObservable (element) {
  return Rx.Observable.fromEvent(element, 'keyup')
      .map(e => e.target.value).startWith('');
}

function createCheckboxObservable (element) {
  return Rx.Observable.fromEvent(element, 'change')
      .map(e => e.target.checked ? e.target.value : '')
      .startWith('');
}

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      __html: ''
    };
  }

  componentDidMount () {
    const string$ = createKeyUpObservable(document.querySelector('#string'));
    const regexp$ = createKeyUpObservable(document.querySelector('#regexp'));
    const global$ = createCheckboxObservable(document.querySelector('#global'));
    const case$ = createCheckboxObservable(document.querySelector('#case'));

    Rx.Observable.combineLatest(string$, regexp$, global$, case$)
      .subscribe(([string, regexp, isGlobal, isCaseInsensitive]) => {
        if (string.length && regexp.length) {
          try{
            this.setState({
              __html: string.replace(new RegExp(regexp, isGlobal+isCaseInsensitive), str => `<span>${str}</span>`)
            });
          } catch (e) {
            window.console.log (e);
          }
        } else {
          this.setState({
            __html: string
          });
        }
      });
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.__html !== nextState.__html;
  }

  render () {
    return (
        <div>
          <input type="text" placeholder="string" id="string" />
          <input type="text" placeholder="regexp" id="regexp" />
          <input type="checkbox" id="global" value="g" /><label>global</label>
          <input type="checkbox" id="case" value="i" /><label>case insensitive</label>
          <pre id="result" dangerouslySetInnerHTML={this.state}></pre>
        </div>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('app'));
