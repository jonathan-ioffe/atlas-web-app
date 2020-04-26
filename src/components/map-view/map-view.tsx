import React, { Component } from 'react'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { Map, View } from 'ol'
import { isMobile } from 'react-device-detect'
import { MapUpdateIntervalSeconds } from '../../constants/app-constants'
import { Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import 'ol/ol.css'
import './style.css'

export interface MapViewProps {
  mapCenter: Coordinate
  baseStationsFeatures: Feature[]
  tagsFeatures: Feature[]
}

export interface MapViewState {
  map: Map
  mapCenterDefined: boolean
  featuresDefined: boolean
  tagsLayer?: VectorLayer
}

export class MapView extends Component<MapViewProps, MapViewState> {
  constructor(props: MapViewProps) {
    super(props)
    this.state = {
      mapCenterDefined: false,
      featuresDefined: false,
      map: new Map({
        target: 'map',
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({
          projection: 'EPSG:4326',
          zoom: 12,
        }),
      }),
    }
  }

  lastUpdateDate = new Date()
  mapDivId = `map-${Math.random()}`
  tagsLayer: VectorLayer | null = null

  componentDidMount() {
    const { map } = this.state
    map.setTarget(this.mapDivId)
  }

  shouldComponentUpdate() {
    const { mapCenterDefined, featuresDefined } = this.state
    const now = new Date()
    var seconds = (now.getTime() - this.lastUpdateDate.getTime()) / 1000
    return (
      !mapCenterDefined ||
      !featuresDefined ||
      seconds >= MapUpdateIntervalSeconds
    )
  }
  componentDidUpdate() {
    const { map, mapCenterDefined, featuresDefined } = this.state
    const { mapCenter, baseStationsFeatures, tagsFeatures } = this.props
    if (!mapCenterDefined) {
      map.getView().setCenter(mapCenter)
      this.setState({ mapCenterDefined: true })
    }
    if (!featuresDefined) {
      map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: baseStationsFeatures,
          }),
        }),
      )
      this.setState({ featuresDefined: true })
    }
    const currTagsLayer = new VectorLayer({
      source: new VectorSource({
        features: tagsFeatures,
      }),
    })
    if (this.tagsLayer != null) map.removeLayer(this.tagsLayer)
    map.addLayer(currTagsLayer)
    this.tagsLayer = currTagsLayer
  }

  render() {
    return (
      <div
        className={`map-view ${isMobile ? '' : 'col-8 col-xs-3 ml-auto'}`}
        id={this.mapDivId}
      ></div>
    )
  }
}
