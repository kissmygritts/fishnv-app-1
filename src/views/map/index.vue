<template>
  <div class="flex-1 flex flex-col">
    <ndow-header-bar />

    <!-- content area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- map section toggle relative to play with child component placement -->
      <section
        v-show="display === 'both' || display === 'map'"
        id="map"
        class="block min-w-0 flex-1 lg:order-last bg-hero-topo"
      >
        <maplibre-map ref="maplibre" :portal-slider="true" @update:moveend="syncUrl" />
      </section>

      <!-- side bar -->
      <aside
        v-if="display === 'both' || display === 'list'"
        class="relative w-full lg:w-120 lg:flex-shink-0 lg:order-first overflow-clip overflow-y-scroll shadow-sm"
      >
        <div v-if="!isLoading">
          <div class="p-2 text-2xl text-oxford-600">{{ totalFishableWaters }} Fishable Waters</div>
          <fw-list-container :fishable-waters="filteredFishableWaters" @card:hover="highlightGeom" />
        </div>
        <ndow-loading v-else />
      </aside>
    </div>

    <filters-panel-mobile />
  </div>
</template>

<script>
import { watch, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import useFishableWaters from '../../composables/use-fishable-waters.js'
import useMobileMenu from '../../composables/use-mobile-menu.js'
import useBreakpoints from '../../composables/use-breakpoints.js'

import ndowHeaderBar from '../../components/ndow-header-bar.vue'
import NdowLoading from '../../components/ndow-loading.vue'
import FiltersPanelMobile from './filters-panel-mobile.vue'
import MaplibreMap from '../../components/maplibre-map.vue'
import fwListContainer from './fw-list-container.vue'

import { layers } from '../../lib/maplibre-layers.js'

export default {
  name: 'map-view',
  components: {
    ndowHeaderBar,
    FiltersPanelMobile,
    MaplibreMap,
    fwListContainer,
    NdowLoading
  },

  setup() {
    const {
      fishableWaters,
      isLoading,
      error,
      filters,
      hasFilters,
      filteredFishableWaters,
      totalFishableWaters,
      fwIds
    } = useFishableWaters()
    const { open: openMobileMenu, display, transitionDisplay } = useMobileMenu()

    const { breakpoints } = useBreakpoints()
    watch(
      () => breakpoints.w,
      (bp) => {
        if (bp >= 1024) transitionDisplay('toBoth')
        else transitionDisplay('toList')
      }
    )

    // map interactions
    const route = useRoute()
    const router = useRouter()
    const syncUrl = ({ bounds, ...layout }) => { router.replace({ query: { ...route.query, ...layout } }) }

    const highlightGeom = ({ id, hover }) => {
      const polygonFilter = ['==', '$type', 'Polygon']
      if (hover) {
        const lines = ['==', '$id', id]
        const poly = ['all', polygonFilter, lines]
        maplibre.value.map.setFilter('hovered-fw-lines', lines)
        maplibre.value.map.setFilter('hovered-fw-polygons', poly)
      }
    }

    // map methods
    const maplibre = ref(null)
    watch(fwIds, async (curr) => {
      await nextTick()
      maplibre.value.map.setFilter('fw-lines', curr)
      maplibre.value.map.setFilter('fw-polygons', ['all', ['==', '$type', 'Polygon'], curr])

      layers.forEach(def => {
        def.layers.forEach((layer) => {
          if (layer.id == 'fw-lines') layer.filter = curr
          if (layer.id == 'fw-polygons') layer.filter = ['all', ['==', '$type', 'Polygon'], curr]
        })
      })
    },
      { deep: true }
    )

    watch(display, async () => {
      await nextTick()
      maplibre.value.map.resize()
    })

    return {
      fishableWaters,
      isLoading,
      error,
      filters,
      hasFilters,
      filteredFishableWaters,
      totalFishableWaters,
      fwIds,

      // mobile menu method
      openMobileMenu,

      // mobile display state machine
      display,
      transitionDisplay,
      breakpoints,

      // map interactions
      syncUrl,
      maplibre,
      highlightGeom
    }
  }
}
</script>
