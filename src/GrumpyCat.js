import React, { Component } from 'react';
import GrumpyCatPic from './grumpycatno.png';

export default class GrumpyCat extends Component {
  render() {
    if (this.props.length >= 10) {
      return <img src={GrumpyCatPic}/>;
    }
    return null;
  }
};

