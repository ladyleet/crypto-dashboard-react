import React, { Component } from 'react';
import { Subject } from 'rxjs';

export default class Card extends Component {
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
