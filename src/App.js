import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from './logo.svg';
import './App.css';
import 'material-components-web/dist/material-components-web.css';
import '@material/card/dist/mdc.card.css';

/* const app = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-around'
};

const tile = {
  backgroundColor: 'red',
  border: '1px solid green',
  flexGrow: '1',
  minWidth: 200,
  height: 500
}; */
import { Observable, fromEvent, Subject, merge } from 'rxjs/index';
import { ajax } from 'rxjs/ajax';
import { tap, map, mergeMap, take, takeUntil, switchMap, ignoreElements, filter } from 'rxjs/operators';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*

curl https://rest.coinapi.io/v1/symbols --request GET --header "X-CoinAPI-Key: 73034021-0EBC-493D-8A00-E0F138111F41"
  */

/*function coinApi(options) {
  const headers = {
    'X-CoinAPI-Key': '4EC05E71-AAD9-4BAF-9782-D49509599CE3',
    ...options.headers
  };
  return ajax({ headers, ...options });
}

function symbolIdFor(options) {
  return `${exchangeId}_SPOT_${asset_id_base}_${asset_id_quote}`;
}

function fetchSymbols() {
  return coinApi({ url: 'https://rest.coinapi.io/v1/symbols?filter_asset_id_base=ETH' });
}

window.fetchSymbols = fetchSymbols;*/

const symbols = ['BTC', 'ETH'];

function coinWebSocket() {
  return new Observable(observer => {
    setInterval(() => {
      const symbol =  symbols[Math.floor(Math.random() * symbols.length)];

      observer.next({
        "type": "quote",
        "symbol_id": symbol,
        "time_exchange": (new Date).toISOString(),
        "time_coinapi": (new Date).toISOString(),
        "ask_price": getRandomInt(700, 750),
        "ask_size": getRandomInt(3000, 3500),
        "bid_price": getRandomInt(700, 750),
        "bid_size": getRandomInt(10, 100)
      });
    }, 1000);
  });
}

class Card extends Component {
  defaultState = {
    width: null,
    height: null,
    left: null,
    top: null,
    isDragging: false
  };
  state = {
    ...this.defaultState,
    whatever: false

  };
  card = null;

  mouseDown$ = new Subject();

  componentDidMount() {
    /*const dragstart$ = fromEvent(document, 'dragstart');
    const dragstop$ = fromEvent(document, 'dragstop');
    const drag$ = fromEvent(document, 'drag');
    const dragenter$ = fromEvent(document, 'dragover');
    const dragleave$ = fromEvent(document, 'dragleave');
    const dragovers = Array.from(document.querySelectorAll('.mdc-layout-grid__cell'))
      .map(el => fromEvent(el, 'dragover'));
    const dragover$ = merge(...dragovers);

    function isDescendantOfSelector(child, selector) {

    }

    const dragRequest$ = dragstart$.pipe(
      tap(event => {
        event.dataTransfer.effectAllowed = 'move';
      }),
      switchMap(({ target: dragged }) =>
        merge(
          dragover$.pipe(
            
            take(1),
            tap(event => {
              console.log(event);
              event.dataTransfer.dropEffect = 'move';
              event.target.style.border = '2px solid green';
              event.target.style.boxShadow = '0px 0px 100px rgba(0, 255, 0, 1)';
            }),
            /switchMap(({ target: dropped }) =>
              dragleave$.pipe(
                tap(({ target  }) => {
                  target.style.boxShadow = '';
                }),
                ignoreElements()
              )
            )
          )
        )
      )
    );

    dragRequest$.subscribe(({ dragged, dropped }) => {
      //const dragged = dragged.parentNode;
      //dropped.parentNode.insertBefore(dragged, dropped);
    });*/
    
  }

  render() {
    const dragStyle = { ...this.defaultState };
    if (this.state.isDragging) {
      dragStyle.position = 'absolute';
      dragStyle.width = this.state.width;
      dragStyle.height = this.state.height;
      dragStyle.left = this.state.left;
      dragStyle.top = this.state.top;
    }

    return (
      <div className="mdc-layout-grid__cell">
        <div
          className="mdc-card"
          ref={node => this.card = node}
          style={dragStyle}
          onMouseDown={event => this.mouseDown$.next(event)}
          draggable
        >
          <div className="dropzone" style={{ backgroundColor: 'red', width: '100%', height: 300 }} />
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              <button className="mdc-button mdc-card__action mdc-card__action--button">Action 1</button>
            </div>
            <div className="mdc-card__action-icons">
              <i className="material-icons mdc-card__action mdc-card__action--icon" tabIndex="0" role="button" title="Share">share</i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class SymbolSearchInput extends Component {
  symbolsById = null;

  /*updateSymbolTable() {
    fetchSymbols().pipe(
        tap(({ response: symbols }) => {
          debugger;
        }),
        map(({ response: symbols }) => {
          debugger;
          return symbols.reduce((table, symbol) => {
            table[symbol.asset_id_base] = symbol;
            return table;
          }, {})
        })
      )
        .subscribe(table => {
          this.symbolsById = table;
        });
  }*/

  didChangeInput = (event) => {
    this.updateSymbolTable();
  };

  render() {
    return (
      <input
        onChange={this.didChangeInput}
      />
    )
  }
}

class LineGraph extends Component {
  domainForData(data) {
    if (data.length) {
      return [
        new Date(data[0].x),
        new Date(data[data.length - 1].x)
      ];
    } else {
      return [];
    }
  }

  render() {
    const { data } = this.props;
    const width = 500;
    const height = 200;
    const domain = this.domainForData(data);

    const xScale = d3.scaleTime()
      .domain(domain)
      .rangeRound([0, width]);
    const yScale = d3.scaleLinear()//.rangeRound([height, 0]);
    const line = d3.line()
      .x(d => xScale(new Date(d.x)))
      .y(d => yScale(d.y));
    if (data.length) {
      console.log(domain)
      console.log(xScale(new Date(data[data.length - 1].x)), yScale(data[0].y));
  }

    return (
      <svg width={1000} height={1000}>
        <path d={line(data)} stroke="red" strokeWidth="2" fill="none" />
      </svg>
    );
  }
}

class App extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    coinWebSocket()
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
