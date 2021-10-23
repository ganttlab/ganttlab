<template>
  <div>
    <div id="legacyChart"></div>
  </div>
</template>

<script>
import * as d3 from 'd3-v3';
import moment from 'moment-timezone';
import { getConvertedTasks } from '.';

export default {
  data: function () {
    return {
      convertedTasks: [],
    };
  },
  props: ['tasks'],
  watch: {
    tasks: function (value) {
      if (value && value.length) this.refreshChart();
    },
  },
  methods: {
    // thank you Florian Roscheck for this, you made an awesome work I only needed to tweak a little
    visavailChart: function () {
      // define chart layout
      const margin = {
        // top margin includes title and legend
        top: 70,

        // right margin should provide space for last horz. axis title
        right: 40,

        bottom: 20,

        // left margin should provide space for y axis titles
        left: 250,
      };

      // height of horizontal data bars
      const dataHeight = 18;

      // spacing between horizontal data bars
      const lineSpacing = 14;

      // vertical space for heading
      const paddingTopHeading = -50;

      // vertical overhang of vertical grid lines on bottom
      const paddingBottom = 10;

      // space for y axis titles
      const paddingLeft = -250;

      let width = window.innerWidth - margin.left - margin.right - 10;

      // title of chart is drawn or not (default: yes)
      let drawTitle = 0;

      // year ticks to be emphasized or not (default: yes)
      let emphasizeYearTicks = 1;

      // define chart pagination
      // max. no. of datasets that is displayed, 0: all (default: all)
      let maxDisplayDatasets = 0;

      // dataset that is displayed first in the current
      // display, chart will show datasets "curDisplayFirstDataset" to
      // "curDisplayFirstDataset+maxDisplayDatasets"
      let curDisplayFirstDataset = 0;

      // global div for taskTooltip
      const div = d3
        .select('#legacyChart')
        .append('div')
        .attr('class', 'taskTooltip')
        .style('opacity', 0);

      let definedBlocks = null;
      let isDateOnlyFormat = null;

      function chart(selection) {
        selection.each(function drawGraph(dataset) {
          // check which subset of datasets have to be displayed
          let maxPages = 0;
          let startSet;
          let endSet;
          if (maxDisplayDatasets !== 0) {
            startSet = curDisplayFirstDataset;
            if (curDisplayFirstDataset + maxDisplayDatasets > dataset.length) {
              endSet = dataset.length;
            } else {
              endSet = curDisplayFirstDataset + maxDisplayDatasets;
            }
            maxPages = Math.ceil(dataset.length / maxDisplayDatasets);
          } else {
            startSet = 0;
            endSet = dataset.length;
          }

          // append data attribute in HTML for pagination interface
          selection.attr('data-max-pages', maxPages);

          const noOfDatasets = endSet - startSet;
          const height =
            dataHeight * noOfDatasets + lineSpacing * noOfDatasets - 1;

          // check how data is arranged
          if (definedBlocks === null) {
            definedBlocks = 0;
            for (const element of dataset) {
              if (element.data[0].length === 3) {
                definedBlocks = 1;
                break;
              } else {
                if (definedBlocks) {
                  throw new Error(
                    'Detected different data formats in input data. Format can either be ' +
                      'continuous data format or time gap data format but not both.',
                  );
                }
              }
            }
          }

          // parse data text strings to JavaScript date stamps
          const parseDate = d3.time.format('%Y-%m-%d');
          const parseDateTime = d3.time.format('%Y-%m-%d %H:%M:%S');
          const parseDateRegEx = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
          const parseDateTimeRegEx = new RegExp(
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
          );
          if (isDateOnlyFormat === null) {
            isDateOnlyFormat = true;
          }
          dataset.forEach(function (d) {
            d.data.forEach(function (d1) {
              if (!(d1[0] instanceof Date)) {
                if (parseDateRegEx.test(d1[0])) {
                  // d1[0] is date without time data
                  d1[0] = parseDate.parse(d1[0]);
                } else if (parseDateTimeRegEx.test(d1[0])) {
                  // d1[0] is date with time data
                  d1[0] = parseDateTime.parse(d1[0]);
                  isDateOnlyFormat = false;
                } else {
                  throw new Error(
                    "Date/time format not recognized. Pick between 'YYYY-MM-DD' or " +
                      "'YYYY-MM-DD HH:MM:SS'.",
                  );
                }

                if (!definedBlocks) {
                  d1[2] = d3.time.second.offset(d1[0], d.interval_s);
                } else {
                  if (parseDateRegEx.test(d1[2])) {
                    // d1[2] is date without time data
                    d1[2] = parseDate.parse(d1[2]);
                  } else if (parseDateTimeRegEx.test(d1[2])) {
                    // d1[2] is date with time data
                    d1[2] = parseDateTime.parse(d1[2]);
                  } else {
                    throw new Error(
                      "Date/time format not recognized. Pick between 'YYYY-MM-DD' or " +
                        "'YYYY-MM-DD HH:MM:SS'.",
                    );
                  }
                }
              }
            });
          });

          // cluster data by dates to form time blocks
          dataset.forEach(function (series, seriesI) {
            const tmpData = [];
            const dataLength = series.data.length;
            series.data.forEach(function (d, i) {
              if (i !== 0 && i < dataLength) {
                if (d[1] === tmpData[tmpData.length - 1][1]) {
                  // the value has not changed since the last date
                  if (definedBlocks) {
                    if (
                      tmpData[tmpData.length - 1][2].getTime() ===
                      d[0].getTime()
                    ) {
                      // end of old and start of new block are the same
                      tmpData[tmpData.length - 1][2] = d[2];
                      tmpData[tmpData.length - 1][3] = 1;
                    } else {
                      tmpData.push(d);
                    }
                  } else {
                    tmpData[tmpData.length - 1][2] = d[2];
                    tmpData[tmpData.length - 1][3] = 1;
                  }
                } else {
                  // the value has changed since the last date
                  d[3] = 0;
                  if (!definedBlocks) {
                    // extend last block until new block starts
                    tmpData[tmpData.length - 1][2] = d[0];
                  }
                  tmpData.push(d);
                }
              } else if (i === 0) {
                d[3] = 0;
                tmpData.push(d);
              }
            });
            dataset[seriesI].dispData = tmpData;
          });

          // determine start and end dates among all nested datasets
          let startDate = 0;
          let endDate = 0;

          dataset.forEach(function (series) {
            if (series.dispData.length > 0) {
              if (startDate === 0) {
                startDate = series.dispData[0][0];
                endDate = series.dispData[series.dispData.length - 1][2];
              } else {
                if (series.dispData[0][0] < startDate) {
                  startDate = series.dispData[0][0];
                }
                if (series.dispData[series.dispData.length - 1][2] > endDate) {
                  endDate = series.dispData[series.dispData.length - 1][2];
                }
              }
            }
          });

          // define scales
          const xScale = d3.time
            .scale()
            .domain([startDate, endDate])
            .range([0, width])
            .clamp(1);

          // define axes
          const xAxis = d3.svg.axis().scale(xScale).orient('top');

          // create SVG element
          const svg = d3
            .select(this)
            .append('svg')
            .attr('width', width + margin.left + margin.right - 20)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
              'transform',
              'translate(' + margin.left + ',' + margin.top + ')',
            );

          // create basic element groups
          svg.append('g').attr('id', 'g_title');
          svg.append('g').attr('id', 'g_axis');
          svg.append('g').attr('id', 'g_data');

          // create y axis labels
          svg
            .select('#g_axis')
            .selectAll('text')
            .data(dataset.slice(startSet, endSet))
            .enter()
            .append('a')
            .attr('xlink:href', function (d) {
              return d.link;
            })
            .attr('xlink:show', 'new')
            .append('text')
            .attr('x', paddingLeft)
            .attr('y', lineSpacing + dataHeight / 2)
            .text(function (d) {
              return d.title;
            })
            .attr('transform', function (d, i) {
              return 'translate(0,' + (lineSpacing + dataHeight) * i + ')';
            })
            .attr('class', 'ytitle');

          // create vertical grid
          svg
            .select('#g_axis')
            .selectAll('line.vert_grid')
            .data(xScale.ticks())
            .enter()
            .append('line')
            .attr({
              class: 'vert_grid',
              x1: function (d) {
                return xScale(d);
              },
              x2: function (d) {
                return xScale(d);
              },
              y1: 0,
              y2:
                dataHeight * noOfDatasets +
                lineSpacing * noOfDatasets -
                1 +
                paddingBottom,
            });

          const getHGridY = (i) => {
            return (
              (lineSpacing + dataHeight) * i + lineSpacing + dataHeight / 2
            );
          };

          // create horizontal grid
          svg
            .select('#g_axis')
            .selectAll('line.horz_grid')
            .data(dataset)
            .enter()
            .append('line')
            .attr({
              class: 'horz_grid',
              x1: 0,
              x2: width,
              y1: function (d, i) {
                return getHGridY(i);
              },
              y2: function (d, i) {
                return getHGridY(i);
              },
            });

          // create x axis
          svg.select('#g_axis').append('g').attr('class', 'axis').call(xAxis);

          // make y groups for different data series
          const g = svg
            .select('#g_data')
            .selectAll('.g_data')
            .data(dataset.slice(startSet, endSet))
            .enter()
            .append('a')
            .attr('xlink:href', function (d) {
              return d.link;
            })
            .attr('xlink:show', 'new')
            .append('g')
            .attr('transform', function (d, i) {
              return 'translate(0,' + (lineSpacing + dataHeight) * i + ')';
            })
            .attr('class', 'dataset');

          // add data series
          g.selectAll('rect')
            .data(function (d) {
              return d.dispData;
            })
            .enter()
            .append('rect')
            .attr('x', function (d) {
              return xScale(d[0]);
            })
            .attr('y', lineSpacing)
            .attr('width', function (d) {
              return xScale(d[2]) - xScale(d[0]);
            })
            .attr('height', dataHeight)
            .attr('class', function (d) {
              if (d[1] === 1) {
                return 'rect_has_data';
              }
              return 'rect_has_no_data';
            })
            .on('mouseover', function (d) {
              const matrix = this.getScreenCTM().translate(
                +this.getAttribute('x'),
                +this.getAttribute('y'),
              );
              div.transition().duration(200).style('opacity', 0.9);
              div
                .html(function () {
                  let output = '';
                  if (d[1] === 1) {
                    output =
                      '<i class="fa fa-fw fa-check taskTooltip_has_data"></i>';
                  } else {
                    output =
                      '<i class="fa fa-fw fa-times taskTooltip_has_no_data"></i>';
                  }
                  if (isDateOnlyFormat) {
                    if (d[2] > d3.time.second.offset(d[0], 86400)) {
                      output =
                        output +
                        moment(parseDate(d[0])).format('l') +
                        ' - ' +
                        moment(parseDate(d[2])).format('l');
                    } else {
                      output = output + moment(parseDate(d[0])).format('l');
                    }
                  } else {
                    if (d[2] > d3.time.second.offset(d[0], 86400)) {
                      output =
                        output +
                        moment(parseDateTime(d[0])).format('l') +
                        ' ' +
                        moment(parseDateTime(d[0])).format('LTS') +
                        ' - ' +
                        moment(parseDateTime(d[2])).format('l') +
                        ' ' +
                        moment(parseDateTime(d[2])).format('LTS');
                    } else {
                      output =
                        output +
                        moment(parseDateTime(d[0])).format('LTS') +
                        ' - ' +
                        moment(parseDateTime(d[2])).format('LTS');
                    }
                  }
                  return output;
                })
                .style('left', function () {
                  return window.pageXOffset + matrix.e + 'px';
                })
                .style('top', function () {
                  return window.pageYOffset + matrix.f - 11 + 'px';
                })
                .style('height', dataHeight + 11 + 'px');
            })
            .on('mouseout', function () {
              div.transition().duration(500).style('opacity', 0);
            });

          // rework ticks and grid for better visual structure
          function isYear(t) {
            return +t === +new Date(t.getFullYear(), 0, 1, 0, 0, 0);
          }

          function isMonth(t) {
            return +t === +new Date(t.getFullYear(), t.getMonth(), 1, 0, 0, 0);
          }

          const xTicks = xScale.ticks();
          const isYearTick = xTicks.map(isYear);
          const isMonthTick = xTicks.map(isMonth);
          // year emphasis
          // ensure year emphasis is only active if years are the biggest clustering unit
          if (
            emphasizeYearTicks &&
            !isYearTick.every(function (d) {
              return d === true;
            }) &&
            isMonthTick.every(function (d) {
              return d === true;
            })
          ) {
            d3.selectAll('g.tick').each(function (d, i) {
              if (isYearTick[i]) {
                d3.select(this).attr({
                  class: 'x_tick_emph',
                });
              }
            });
            d3.selectAll('.vert_grid').each(function (d, i) {
              if (isYearTick[i]) {
                d3.select(this).attr({
                  class: 'vert_grid_emph',
                });
              }
            });
          }

          // today emphasis
          const todayDate = new Date();
          let emphasizedToday = false;
          todayDate.setHours(0, 0, 0, 0);
          d3.selectAll('g.tick').each(function (d) {
            if (d.getTime() === todayDate.getTime()) {
              // tick exists for today, emphasizing it
              d3.select(this).attr({
                class: 'x_tick_today',
              });
            }
          });
          d3.selectAll('.vert_grid').each(function (d) {
            if (d.getTime() === todayDate.getTime()) {
              // vertical line exists in the grid for today, emphasizing it
              d3.select(this).attr({
                class: 'vert_grid_today',
                'stroke-dasharray': '10, 5',
              });
              emphasizedToday = true;
            }
          });

          // not emphasized today yet
          if (emphasizedToday === false) {
            let interpolatedX = xScale.interpolate(d3.interpolate)(todayDate);
            const lastInterpolatedX = xScale.interpolate(d3.interpolate)(
              endDate,
            );
            if (interpolatedX === lastInterpolatedX && todayDate > endDate) {
              // today is out of range (not displayed in the chart)
              interpolatedX += 18;
            }
            // adding the emphasized today vertical line
            svg
              .select('#g_axis')
              .append('line')
              .attr({
                class: 'vert_grid_today',
                'stroke-dasharray': '10, 5',
                x1: interpolatedX,
                x2: interpolatedX,
                y1: 0,
                y2:
                  dataHeight * noOfDatasets +
                  lineSpacing * noOfDatasets -
                  1 +
                  paddingBottom,
              });
          }

          // create title
          if (drawTitle) {
            svg
              .select('#g_title')
              .append('text')
              .attr('x', paddingLeft)
              .attr('y', paddingTopHeading)
              .text('Data Availability Plot')
              .attr('class', 'heading');
          }

          // create subtitle
          let subtitleText = '';
          if (isDateOnlyFormat) {
            subtitleText =
              moment(parseDate(startDate)).format('l') +
              ' - ' +
              moment(parseDate(endDate)).format('l');
          } else {
            subtitleText =
              moment(parseDateTime(startDate)).format('l') +
              ' ' +
              moment(parseDateTime(startDate)).format('LTS') +
              ' - ' +
              moment(parseDateTime(endDate)).format('l') +
              ' ' +
              moment(parseDateTime(endDate)).format('LTS');
          }

          svg
            .select('#g_title')
            .append('text')
            .attr('x', paddingLeft)
            .attr('y', paddingTopHeading + 17)
            .text(subtitleText)
            .attr('class', 'subheading');

          // create legend
          const legend = svg
            .select('#g_title')
            .append('g')
            .attr('id', 'g_legend')
            .attr('transform', 'translate(20,-12)');

          legend
            .append('rect')
            .attr('x', width + margin.right - 150 + 50)
            .attr('y', paddingTopHeading)
            .attr('height', 15)
            .attr('width', 15)
            .attr('class', 'rect_has_data');

          legend
            .append('text')
            .attr('x', width + margin.right - 150 + 70)
            .attr('y', paddingTopHeading + 8.5)
            .text('On time')
            .attr('class', 'legend');

          legend
            .append('rect')
            .attr('x', width + margin.right - 150 + 50)
            .attr('y', paddingTopHeading + 17)
            .attr('height', 15)
            .attr('width', 15)
            .attr('class', 'rect_has_no_data');

          legend
            .append('text')
            .attr('x', width + margin.right - 150 + 70)
            .attr('y', paddingTopHeading + 8.5 + 15 + 2)
            .text('Late')
            .attr('class', 'legend');
        });
      }

      chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
      };

      chart.drawTitle = function (_) {
        if (!arguments.length) return drawTitle;
        drawTitle = _;
        return chart;
      };

      chart.maxDisplayDatasets = function (_) {
        if (!arguments.length) return maxDisplayDatasets;
        maxDisplayDatasets = _;
        return chart;
      };

      chart.curDisplayFirstDataset = function (_) {
        if (!arguments.length) return curDisplayFirstDataset;
        curDisplayFirstDataset = _;
        return chart;
      };

      chart.emphasizeYearTicks = function (_) {
        if (!arguments.length) return emphasizeYearTicks;
        emphasizeYearTicks = _;
        return chart;
      };

      return chart;
    },
    refreshChart: function () {
      this.convertedTasks = getConvertedTasks(this.tasks);

      // removing all created taskTooltips to avoid useless scrolling
      const paras = document.getElementsByClassName('taskTooltip');
      while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }

      const chart = this.visavailChart().width(document.body.clientWidth - 290);

      d3.select('#legacyChart').datum(this.convertedTasks).call(chart);
    },
    pad: function (number) {
      let r = String(number);
      if (r.length === 1) {
        r = '0' + r;
      }
      return r;
    },
  },
  mounted: function () {
    // refresh the gantt graph
    if (this.tasks && this.tasks.length) this.refreshChart();
  },
};
</script>

<style lang="scss">
#legacyChart {
  @apply font-sans;

  .rect_has_data {
    /* blocks that have data */
    @apply fill-current text-green-500;
  }

  .rect_has_data:hover {
    @apply fill-current text-green-600;
  }

  .rect_has_no_data {
    /* blocks without data */
    @apply fill-current text-red-500;
  }

  .rect_has_no_data:hover {
    @apply fill-current text-red-700;
  }

  .taskTooltip_has_data {
    /* color of symbol in taskTooltip if there is data */
    @apply text-green-600;
  }

  .taskTooltip_has_no_data {
    /* color of symbol in taskTooltip if there is no data */
    @apply text-red-700;
  }

  div.taskTooltip {
    @apply absolute block font-sans text-xs leading-none text-left p-0 pl-1 w-auto border-l border-black;
    pointer-events: none;
  }

  .x_tick_emph {
    font-weight: bold;
  }

  .x_tick_today {
    font-weight: bold;
  }

  .x_tick_today text {
    @apply text-red-600;
    fill: currentColor !important;
  }

  .ytitle {
    /* y axis labels */
    dominant-baseline: middle;
    @apply font-lead;
    -moz-osx-font-smoothing: grayscale;
    font-size: 12px;
  }

  .axis path,
  .axis line {
    display: none;
  }

  .axis text {
    font-size: 12px;
    -moz-osx-font-smoothing: grayscale;
    @apply text-gray-600;
    fill: currentColor;
  }

  .vert_grid {
    fill: none;
    @apply text-gray-200;
    stroke: currentColor;
    stroke-width: 1px;
  }

  .vert_grid_emph {
    fill: none;
    @apply text-gray-200;
    stroke: currentColor;
    stroke-width: 2px;
  }

  .vert_grid_today {
    fill: none;
    @apply text-red-600;
    stroke: currentColor;
    stroke-width: 2px;
  }

  .horz_grid {
    fill: none;
    @apply text-gray-200;
    stroke: currentColor;
    stroke-width: 1px;
  }

  .heading {
    font-size: 16px;
    -moz-osx-font-smoothing: grayscale;
    font-weight: bold;
  }

  .subheading {
    font-size: 12px;
    -moz-osx-font-smoothing: grayscale;
    @apply text-gray-600;
    fill: currentColor;
  }

  .legend {
    dominant-baseline: middle;
    font-size: 12px;
    -moz-osx-font-smoothing: grayscale;
    @apply text-gray-600;
    fill: currentColor;
  }
}
</style>
