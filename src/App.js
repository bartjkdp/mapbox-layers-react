import React from 'react'
import update from 'immutability-helper'
import mapboxgl from 'mapbox-gl'
import './App.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYmFydGprZHAiLCJhIjoiY2s3bWw0aGR6MGRoMzNtcGE5cnZxN2FxeSJ9.AovNhGwT2E1j35AjLlLf9Q'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      layers: {
        'contours': true,
        'museums': true
      }
    }
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 15,
      center: [-71.97722138410576, -13.517379300798098]
    })

    this.map.on('load', () => {
      this.map.addSource('museums', {
        type: 'vector',
        url: 'mapbox://mapbox.2opop9hr'
      })
      this.map.addLayer({
        'id': 'museums',
        'type': 'circle',
        'source': 'museums',
        'layout': {
            'visibility': this.state.layers['museums'] ? 'visible' : 'none'
        },
        'paint': {
            'circle-radius': 8,
            'circle-color': 'rgba(55,148,179,1)'
        },
        'source-layer': 'museum-cusco'
      })
      this.map.addSource('contours', {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-terrain-v2'
      })
      this.map.addLayer({
          'id': 'contours',
          'type': 'line',
          'source': 'contours',
          'source-layer': 'contour',
          'layout': {
              'visibility': this.state.layers['contours'] ? 'visible' : 'none',
              'line-join': 'round',
              'line-cap': 'round'
          },
          'paint': {
              'line-color': '#877b59',
              'line-width': 1
          }
      })
    })
  }

  toggleLayer(layer) {
    if (!this.map) {
      return // if the map is not initialized do nothing
    }

    const newState = !this.state.layers[layer]

    this.map.setLayoutProperty(layer, 'visibility', newState ? 'visible' : 'none')

    this.setState(update(this.state, {
      layers: { [layer]: {$set: newState} }
    }))
  }

  render() {
    return (
      <div className="App">
        <div id="map" ref={el => this.mapContainer = el} />
        <div id="menu">
          {Object.keys(this.state.layers).map((layer) => (
            <button key={layer} onClick={() => this.toggleLayer(layer)} className={this.state.layers[layer] ? "active" : ""}>{layer}</button>
          ))}
        </div>
      </div>
    )
  }
}
