import React, { Component } from 'react';
import * as d3 from 'd3';
import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operators';

function makeRainbow(length) {
  if (length % 5 === 0) {
    return 'red';
  }
  if (length % 4 === 0) {
    return 'orange';
  }
  if (length % 3 === 0) {
    return 'yellow';
  }
  if (length % 2 === 0) {
    return 'green';
  }
  return 'blue';
};

export default class LineGraph extends Component {
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
Î
  render() {
    const { data, length } = this.props;
    const width = 500;
    const height = 200;
    const domain = this.domainForData(data);
    const filterRainbow$ = new Subject();

    const xScale = d3.scaleTime()
      .domain(domain)
      .rangeRound([0, width]);
    const yScale = d3.scaleLinear()//.rangeRound([height, 0]);
    const line = d3.line()
      .x(d => xScale(new Date(d.x)))
      .y(d => yScale(d.y));
    // const makeRainbow$ = e => {
    //   return e.target.matches(length % 2)
    //   ? this.filterRainbow$.pipe(
    //     filter((e)) : ""
    //   )
    // }; 

    return (
      <svg width={500} height={500}>
        <path d={line(data)} stroke={makeRainbow(data.length)} strokeWidth="2" fill="none" />
      </svg>
    );
  }
}
