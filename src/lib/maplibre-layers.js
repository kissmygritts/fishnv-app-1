const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY

// basemaps layers
export const basemaps = [
  {
    name: 'voyager',
    description: 'A simple, light colored basemap.',
    active: true,
    thumbnail: 'https://cloud.maptiler.com/static/img/maps/voyager.png?t=1634127409',
    style: `https://api.maptiler.com/maps/voyager/style.json?key=${MAPTILER_KEY}`
  },
  {
    name: 'topo',
    description: 'A topographic basemap with hillshade.',
    active: false,
    thumbnail: 'https://cloud.maptiler.com/static/img/maps/outdoor.png?t=1634127409',
    style: `https://api.maptiler.com/maps/topo/style.json?key=${MAPTILER_KEY}`
  },
  {
    name: 'satellite',
    description: 'A satellite map with labels.',
    active: false,
    thumbnail: 'https://cloud.maptiler.com/static/img/maps/hybrid.png?t=1634127409',
    style: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`
  }
]

// overlays (layers)
export const fishableWaters = {
  name: 'fishable waters',
  id: 'fishable-waters',
  description: 'Fishable waters of Nevada.',
  active: true,
  thumbnail: 'https://ndow-cdn.s3.us-west-2.amazonaws.com/maptile-previews/fishable-waters.png',
  source: {
    'fishable-waters': {
      type: 'vector',
      tiles: ['https://tiles.wildlifenv.com/fishable-waters/{z}/{x}/{y}.pbf']
    }
  },
  layers: [
    {
      id: 'fw-lines',
      type: 'line',
      source: 'fishable-waters',
      'source-layer': 'fishable-waters',
      layout: {
        visibility: 'visible',
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-opacity': 1,
        'line-color': '#589fd6',
        'line-width': 2
      }
    },
    {
      id: 'fw-polygons',
      type: 'fill',
      source: 'fishable-waters',
      'source-layer': 'fishable-waters',
      layout: {
        visibility: 'visible',
      },
      paint: {
        'fill-opacity': 0.75,
        'fill-color': '#589fd6'
      },
      filter: ['==', '$type', 'Polygon']
    },
    {
      id: 'hovered-fw-lines',
      type: 'line',
      source: 'fishable-waters',
      'source-layer': 'fishable-waters',
      layout: {
        visibility: 'visible',
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#f29647',
        'line-width': 4
      },
      filter: ['==', '$id', 0]
    },
    {
      id: 'hovered-fw-polygons',
      type: 'fill',
      source: 'fishable-waters',
      'source-layer': 'fishable-waters',
      layout: {
        visibility: 'visible',
      },
      paint: {
        'fill-color': '#f29647'
      },
      filter: ['all', ['==', '$type', 'Polygon'], ['==', '$id', 0]]
    }
    // {
    //   id: 'labels-fw-lines',
    //   type: 'symbol',
    //   source: 'fishable-waters',
    //   'source-layer': 'fishable_waters',
    //   layout: {
    //     visibility: 'visible',
    //     'symbol-placement': 'line',
    //     'text-font': ['Open Sans Regular'],
    //     'text-field': ['get', 'water_name'],
    //     'text-anchor': 'top',
    //     'text-size': 16
    //   },
    //   paint: {
    //     'text-color': '#589fd6',
    //     'text-halo-color': 'white',
    //     'text-halo-width': 1,
    //     'text-halo-blur': 1
    //   }
    // }
  ]
}

export const huntUnits = {
  name: 'hunt units',
  id: 'hunt-units',
  description: 'NDOW hunt units.',
  active: false,
  thumbnail:
    'https://ndow-cdn.s3.us-west-2.amazonaws.com/maptile-previews/hunt-units.png',
  source: {
    'hunt-units': {
      type: 'vector',
      tiles: ['https://tiles.wildlifenv.com/hunt-units/{z}/{x}/{y}.pbf']
    }
  },
  layers: [
    {
      id: 'unit-labels',
      type: 'symbol',
      source: 'hunt-units',
      'source-layer': 'label_huntunits',
      layout: {
        visibility: 'none',
        'text-font': ['Open Sans Regular'],
        'text-field': ['get', 'display_name'],
        'text-size': 16
      },
      paint: {
        'text-color': '#db6f0f',
        'text-halo-color': 'white',
        'text-halo-width': 1,
        'text-halo-blur': 1
      },
      filter: ['==', 'is_open', 'true']
    },
    {
      id: 'hunt-units-outline',
      type: 'line',
      source: 'hunt-units',
      'source-layer': 'ndow_huntunits',
      layout: {
        visibility: 'none',
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-opacity': 1,
        'line-color': '#f29645',
        'line-width': 2
      }
    }
  ]
}

export const publicLandownership = {
  name: 'public land',
  id: 'public-landownership',
  description: 'Public landownership data from USGS.',
  active: false,
  thumbnail:
    'https://ndow-cdn.s3.us-west-2.amazonaws.com/maptile-previews/hunt-units.png',
  source: {
    'public-landownership': {
      type: 'vector',
      tiles: ['https://tiles.wildlifenv.com/public-lands/{z}/{x}/{y}.pbf'],
      minzoom: 6,
      maxzoom: 16
    }
  },
  layers: [
    {
      id: 'landownership-fill',
      type: 'fill',
      source: 'public-landownership',
      'source-layer': 'public_lands',
      layout: {
        visibility: 'none'
      },
      paint: {
        'fill-opacity': 0.5,
        'fill-color': [
          'match',
          ['get', 'landowner'],
          'BIA',
          '#FEB483',
          'BLM',
          '#FED17E',
          'BOR, USACE',
          '#FDBCDA',
          'City, State, County',
          '#9EE5FB',
          'DOD, DOE',
          '#EDC4A5',
          'FS',
          '#60C99E',
          'NPS',
          '#BECDE8',
          'Parks, Monuments and Refuges',
          '#BECDE8',
          '#ccc'
        ]
      }
    },
    {
      id: 'landownership-outline',
      type: 'line',
      source: 'public-landownership',
      'source-layer': 'public_lands',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'none'
      },
      paint: {
        'line-opacity': 0.2,
        'line-width': 1,
        'line-color': [
          'match',
          ['get', 'landowner'],
          'BIA',
          '#FEB483',
          'BLM',
          '#FED17E',
          'BOR, USACE',
          '#FDBCDA',
          'City, State, County',
          '#9EE5FB',
          'DOD, DOE',
          '#EDC4A5',
          'FS',
          '#60C99E',
          'NPS',
          '#BECDE8',
          'Parks, Monuments and Refuges',
          '#BECDE8',
          '#ccc'
        ]
      }
    }
  ]
}

export const layers = [
  publicLandownership,
  fishableWaters,
  huntUnits,
]
