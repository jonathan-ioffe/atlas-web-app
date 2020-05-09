import React, { FunctionComponent } from 'react'
import { Feature } from 'ol'
import { TagToDetections, TagToLocations } from '../interfaces/tags-structure'
import { BaseStationToTags } from '../interfaces/base-stations-structure'
import { BrowserView, MobileView } from 'react-device-detect'
import { TablesNav } from './tables/tables-nav'
import { MapView } from './map-view'
import { locationsByTagsToCombinedFeatureArray } from '../helpers/map-utils'
import { Carousel } from 'react-responsive-carousel'

export interface MainPageProps {
  baseStationsCenter: number[]
  baseStationsFeatures: Feature[]
  tagToLocations: TagToLocations
  tagToDetections: TagToDetections
  baseStationToTags: BaseStationToTags
  tagsLookedForByBasestations: number[]
}

export const MainPage: FunctionComponent<MainPageProps> = ({
  baseStationsCenter = [0, 0],
  baseStationsFeatures = [],
  tagToLocations = {},
  tagToDetections = {},
  baseStationToTags = {},
  tagsLookedForByBasestations = [],
}: MainPageProps) => (
  <div className='main-page'>
    <div>
      <BrowserView>
        <div className='row'>
          <div className='col-4'>
            <TablesNav
              tagToDetections={tagToDetections}
              baseStationToTags={baseStationToTags}
              tagsLookedForByBasestations={tagsLookedForByBasestations}
            />
          </div>
          <MapView
            mapCenter={baseStationsCenter}
            baseStationsFeatures={baseStationsFeatures}
            tagsFeatures={locationsByTagsToCombinedFeatureArray(tagToLocations)}
          />
        </div>
      </BrowserView>
      <MobileView>
        <Carousel showStatus={false} showThumbs={false} dynamicHeight>
          <div className='w-auto'>
            <TablesNav
              tagToDetections={tagToDetections}
              baseStationToTags={baseStationToTags}
              tagsLookedForByBasestations={tagsLookedForByBasestations}
            />
          </div>
          <div>
            <MapView
              mapCenter={baseStationsCenter}
              baseStationsFeatures={baseStationsFeatures}
              tagsFeatures={locationsByTagsToCombinedFeatureArray(
                tagToLocations,
              )}
            />
          </div>
        </Carousel>
      </MobileView>
    </div>
  </div>
)
