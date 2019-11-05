/*eslint-disable*/
import React from 'react';
import { Bar } from 'react-chartjs-2';

function ChartBar(props) {

  const defProps = {
    width: 200,
    height: 100,
    ref: ref => this.chart = ref,
    data: props.data,
    options: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: 'white',
        }
      },
      scales: {
        yAxes: [{
          gridLines: {
            color: `rgba(255, 255, 255, .2)`,
            display: true,
            drawBorder: true,
            drawOnChartArea: false,
          },
          ticks: {
            fontColor: 'white',
            display: true,
          },
        }],
        xAxes: [{
          gridLines: {
            color: `rgba(255, 255, 255, .2)`,
            display: true,
            drawBorder: true,
            drawOnChartArea: false,
          },
          ticks: {
            fontColor: 'white',
            display: true,
          },
        }]
      },
      maintainAspectRatio: false
    }
  }

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      className="Chart"
    >
      <Bar {...defProps} />
    </div>
  )
}

export default ChartBar;