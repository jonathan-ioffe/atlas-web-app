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
import { ReactComponent as EnabledHomeIcon } from '../../assets/home-enabled.svg'
import { ReactComponent as DisabledHomeIcon } from '../../assets/home-disabled.svg'
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
  isBasestationLayerVisible: boolean
}

export class MapView extends Component<MapViewProps, MapViewState> {
  constructor(props: MapViewProps) {
    super(props)
    this.state = {
      mapCenterDefined: false,
      featuresDefined: false,
      isBasestationLayerVisible: true,
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
  baseStationsLayer: VectorLayer | null = null

  componentDidMount() {
    const { map } = this.state
    map.setTarget(this.mapDivId)
  }

  shouldComponentUpdate() {
    const {
      mapCenterDefined,
      featuresDefined,
      isBasestationLayerVisible,
    } = this.state
    const now = new Date()
    var seconds = (now.getTime() - this.lastUpdateDate.getTime()) / 1000
    let currBaseStationToggleEnabled = this.baseStationsLayer?.getVisible()
    const isToggledBaseStationLayer =
      (currBaseStationToggleEnabled && !isBasestationLayerVisible) ||
      (!currBaseStationToggleEnabled && isBasestationLayerVisible)
    return (
      !mapCenterDefined ||
      !featuresDefined ||
      seconds >= MapUpdateIntervalSeconds ||
      isToggledBaseStationLayer
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
      this.baseStationsLayer = new VectorLayer({
        source: new VectorSource({
          features: baseStationsFeatures,
        }),
      })
      map.addLayer(this.baseStationsLayer)
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
    const { isBasestationLayerVisible } = this.state
    return (
      <div
        className={`map-view ${isMobile ? '' : 'col-8 col-xs-3 ml-auto'}`}
        id={this.mapDivId}
      >
        <button
          className='btn btn-light b-layer-button'
          onClick={() => {
            const currVisibilty = this.baseStationsLayer?.getVisible()
            this.baseStationsLayer?.setVisible(!currVisibilty)
            this.setState({isBasestationLayerVisible: this.baseStationsLayer? this.baseStationsLayer.getVisible(): false})
          }}
        >
          {isBasestationLayerVisible ? (
            <EnabledHomeIcon />
          ) : (
            <DisabledHomeIcon className='logo' />
          )}
        </button>
      </div>
    )
  }
}
