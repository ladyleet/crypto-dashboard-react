import React, { Component } from 'react';
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
import { fromEvent, Subject, merge } from 'rxjs/index';
import { tap, map, mergeMap, takeUntil, switchMap, ignoreElements } from 'rxjs/operators';

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
    /* const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup'); */
    const dragstart$ = fromEvent(document, 'dragstart');
    const dragstop$ = fromEvent(document, 'dragstop');
    const drag$ = fromEvent(document, 'drag');
    const dragenter$ = fromEvent(document, 'dragenter');
    const dragleave$ = fromEvent(document, 'dragleave');

    const dragRequest$ = dragstart$.pipe(
      switchMap(({ target: dragged }) =>
        merge(
          dragenter$.pipe(
            tap(({ target }) => {
              target.style.border = '2px solid green';
            }),
            switchMap(({ target: dropped }) =>
              dragstop$.pipe(
                map(() => ({
                  dragged,
                  dropped
                }))
              )
            )
          ),
          dragleave$.pipe(
            tap(({ target  }) => {
              target.style.border = '';
            }),
            ignoreElements()
          )
        )
      )
    );

    dragRequest$.subscribe(({ dragged, dropped }) => {
      //const dragged = dragged.parentNode;
      //dropped.parentNode.insertBefore(dragged, dropped);
    });

    /* const mouseDrag$ = dragstart$.pipe(
      mergeMap(({ target: draggable, offsetX: startX, offsetY: startY }) =>
        dragenter$.pipe(
          map(mouseMoveEvent => ({
            left: mouseMoveEvent.clientX - startX,
            top: mouseMoveEvent.clientY - startY,
            draggable
          })),
          takeUntil(dragstop$.pipe(
            tap(() => {
              this.setState({ isDragging: false });
            })
          ))
        )
      )
    );
    mouseDrag$.subscribe(({ left, top }) => {
      //console.log({ left, top });
      //this.setState({ left, top, isDragging: true });
    }); */

    
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
          <div style={{ backgroundColor: 'red', width: '100%', height: 300 }} />
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

class App extends Component {
  render() {
    return (
      <div className="mdc-typography">
        <main>
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
