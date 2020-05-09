import React, { Component } from 'react'
import Chart from 'react-apexcharts'
import { BaseStationToInterruptions } from '../interfaces/base-stations-structure'

export interface GraphPageProps {
  timestamps: string[]
  baseStationToInterruptions: BaseStationToInterruptions[]
}

export interface GraphPageState {
  options: object
  series: BaseStationToInterruptions[]
}

export class GraphPage extends Component<GraphPageProps, GraphPageState> {
  constructor(props: GraphPageProps) {
    super(props)
    this.state = {
      options: {
        chart: {
          height: 350,
          type: 'line',
          toolbar: {
            show: false,
          },
        },
        colors: ['#77B6EA', '#545454'],
        stroke: {
          curve: 'smooth',
        },
        title: {
          text: 'Base Stations Interruptions Levels',
          align: 'left',
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: props.timestamps,
          title: {
            text: 'Timestamp',
          },
        },
        yaxis: {
          title: {
            text: 'Interruptions Level',
          },
          min: 0,
          max: 100,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -15,
          offsetX: -5,
        },
      },
      series: props.baseStationToInterruptions,
    }
  }

  render() {
    const { options, series } = this.state
    return (
      <div id='chart' className='m-3'>
        <Chart options={options} series={series} type='line' height={350} />
      </div>
    )
  }
}
