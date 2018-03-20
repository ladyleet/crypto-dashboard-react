import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from './logo.svg';
import './App.css';
import 'material-components-web/dist/material-components-web.css';
import '@material/card/dist/mdc.card.css';
import LineGraph from './LineGraph';
import Header from './Header';
import Card from './Card';
import GrumpyCat from './GrumpyCat';
import { Observable, fromEvent, Subject, merge, interval } from 'rxjs/index';
import { ajax } from 'rxjs/ajax';
import { tap, map, mergeMap, take, takeUntil, switchMap, ignoreElements, filter } from 'rxjs/operators';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class App extends Component {
  state = {
    data: []
  };

  coinWebSocket = interval(500).pipe(
    map(() => ({time_exchange:Date.now(), bid_price:getRandomInt(100, 300)}))
  )

  componentDidMount() {
    this.coinWebSocket
      .subscribe(update => {
        this.setState({
          data: [...this.state.data, {
            x: update.time_exchange,
            y: update.bid_price
          }]
        })
      });
  }

  render() {
    const { data } = this.state;

    return (
      <div className="mdc-typography">
        <main>
          <LineGraph data={data} /> 
          <GrumpyCat length={data.length} />
          <section className="hero">
            <div className="mdc-layout-grid">
              <div className="mdc-layout-grid__inner">
                <Card />
                <Card />
                <Card />
                <Card />
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
