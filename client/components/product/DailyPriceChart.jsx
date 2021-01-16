import React, { useEffect } from 'react';
import * as d3 from 'd3';

const DailyPriceChart = ({ priceHistory }) => {
  const data = priceHistory.map((el) => {
    return {
      date: new Date(el.date),
      price: el.price,
    };
  });

  const drawChart = () => {
    const svgWidth = 1000,
      svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 80 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3
      .select('#container')
      .style('background-color', '#f3f3f3')
      .append('svg')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid Meet');

    const g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const line = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.price);
      });

    x.domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );

    y.domain(
      d3.extent(data, function (d) {
        return d.price;
      })
    );

    g.append('g')
      .attr('transform', 'translate(-50,' + height + ')')
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeDay.every(1))
          .tickFormat(d3.timeFormat('%d-%b-%y'))
          .scale(x)
      )
      .select('.domain')

      .remove();

    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Price ($)');

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  };

  useEffect(() => {
    drawChart();
  }, [data]);

  return (
    <div
      id="container"
      style={{ border: '1px solid lightgrey', margin: '20px' }}
    ></div>
  );
};

export default DailyPriceChart;
