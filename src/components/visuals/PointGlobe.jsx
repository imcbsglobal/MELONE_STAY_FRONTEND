import { useEffect, useRef } from 'react'
import { feature } from 'topojson-client'
import countries from 'world-atlas/countries-110m.json'

const countryFeatures = feature(countries, countries.objects.countries).features
const countryColors = ['rgba(64, 128, 92, .5)', 'rgba(169, 132, 46, .48)', 'rgba(53, 116, 84, .46)', 'rgba(120, 150, 70, .52)', 'rgba(150, 120, 58, .46)', 'rgba(63, 132, 100, .48)']

const makeGlowSprite = (color) => {
  const size = 32
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const spriteContext = sprite.getContext('2d')
  const gradient = spriteContext.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  spriteContext.fillStyle = gradient
  spriteContext.fillRect(0, 0, size, size)
  return sprite
}

function PointGlobe() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let animationFrame
    let rotation = -(78.0 * Math.PI) / 180
    let width = 0
    let height = 0
    let stars = []
    let mapLights = []
    let nightLights = []
    const cameraTilt = 0.36
    let motionPhase = 0
    let lastTime = performance.now()
    let running = false
    let observer = null
    const warmGlow = makeGlowSprite('rgba(255, 200, 115, 1)')
    const coolGlow = makeGlowSprite('rgba(150, 226, 222, 1)')

    // Real-world approximate city coordinates (degrees)
    const cities = [
      { lat: 40.7, lon: -74.0, label: 'NYC' },
      { lat: 51.5, lon: -0.1, label: 'LON' },
      { lat: 38.7, lon: -9.1, label: 'LIS' },
      { lat: 37.8, lon: -122.4, label: 'SFO' },
      { lat: 35.7, lon: 139.7, label: 'TYO' },
      { lat: 25.2, lon: 55.3, label: 'DXB' },
      { lat: 28.6, lon: 77.2, label: 'DEL' },
      { lat: 19.1, lon: 72.9, label: 'BOM' },
      { lat: 12.9, lon: 77.6, label: 'BLR' },
    ]

    const project = (latDeg, lonDeg, rot, radius) => {
      const latRad = (latDeg * Math.PI) / 180
      const theta = (lonDeg * Math.PI) / 180 + rot
      const cosLat = Math.cos(latRad)
      const sphereX = Math.sin(theta) * cosLat
      const sphereY = -Math.sin(latRad)
      const sphereZ = Math.cos(theta) * cosLat
      const tiltedY = sphereY * Math.cos(cameraTilt) - sphereZ * Math.sin(cameraTilt)
      const depth = sphereY * Math.sin(cameraTilt) + sphereZ * Math.cos(cameraTilt)
      return {
        x: sphereX * radius,
        y: tiltedY * radius,
        depth,
      }
    }

    const drawRing = (ring, radius, centerX, centerY, fillColor) => {
      if (!ring.length) return
      const points = new Array(ring.length)
      for (let index = 0; index < ring.length; index += 1) {
        const [lon, lat] = ring[index]
        const point = project(lat, lon, rotation, radius)
        points[index] = { x: centerX + point.x, y: centerY + point.y, depth: point.depth }
      }
      context.beginPath()
      let started = false
      for (let index = 0; index < points.length; index += 1) {
        const point = points[index]
        if (point.depth > 0.02) {
          const previousVisible = points[index === 0 ? points.length - 1 : index - 1].depth > 0.02
          if (!started || !previousVisible) {
            context.moveTo(point.x, point.y)
            started = true
          } else {
            context.lineTo(point.x, point.y)
          }
        } else {
          started = false
        }
      }
      if (fillColor) {
        context.fillStyle = fillColor
        context.fill()
      }
      context.strokeStyle = 'rgba(150, 210, 175, .2)'
      context.lineWidth = 0.45
      context.stroke()
    }

    const drawGeometry = (geometry, radius, centerX, centerY, fillColor) => {
      if (geometry.type === 'Polygon') geometry.coordinates.forEach((ring) => drawRing(ring, radius, centerX, centerY, fillColor))
      if (geometry.type === 'MultiPolygon') geometry.coordinates.forEach((polygon) => polygon.forEach((ring) => drawRing(ring, radius, centerX, centerY, fillColor)))
    }

    const collectLights = (coordinates) => {
      if (mapLights.length >= 6000) return
      coordinates.forEach(([lon, lat]) => mapLights.push({ lon, lat, size: Math.random() * 1.05 + 0.25, alpha: Math.random() * 0.55 + 0.25 }))
    }

    const collectGeometryLights = (geometry) => {
      if (geometry.type === 'Polygon') geometry.coordinates.forEach(collectLights)
      if (geometry.type === 'MultiPolygon') geometry.coordinates.forEach((polygon) => polygon.forEach(collectLights))
    }

    const pointInRing = (longitude, latitude, ring) => {
      let inside = false
      for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
        const [currentLon, currentLat] = ring[index]
        const [previousLon, previousLat] = ring[previous]
        const intersects = currentLat > latitude !== previousLat > latitude && longitude < ((previousLon - currentLon) * (latitude - currentLat)) / (previousLat - currentLat) + currentLon
        if (intersects) inside = !inside
      }
      return inside
    }

    const addNightLights = (ring, random) => {
      const longitudes = ring.map(([longitude]) => longitude)
      const latitudes = ring.map(([, latitude]) => latitude)
      const minLongitude = Math.min(...longitudes)
      const maxLongitude = Math.max(...longitudes)
      const minLatitude = Math.max(-62, Math.min(...latitudes))
      const maxLatitude = Math.min(72, Math.max(...latitudes))
      const samples = Math.min(60, Math.max(2, Math.round((maxLongitude - minLongitude) * (maxLatitude - minLatitude) * 0.014)))

      for (let index = 0; index < samples; index += 1) {
        if (nightLights.length >= 1400) return
        const longitude = minLongitude + random() * (maxLongitude - minLongitude)
        const latitude = minLatitude + random() * (maxLatitude - minLatitude)
        if (pointInRing(longitude, latitude, ring)) nightLights.push({ longitude, latitude, size: random() * 1.05 + 0.25, alpha: random() * 0.55 + 0.2 })
      }
    }

    const buildScene = () => {
      stars = Array.from({ length: 130 }, () => ({ x: Math.random(), y: Math.random(), size: Math.random() * 1.2 + 0.2, alpha: Math.random() * 0.45 + 0.12 }))
      mapLights = []
      nightLights = []
      let seed = 7429
      const random = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }
      countryFeatures.forEach(({ geometry }) => collectGeometryLights(geometry))
      countryFeatures.forEach(({ geometry }) => {
        const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
        polygons.forEach((polygon) => addNightLights(polygon[0], random))
      })
      for (let index = 0; index < 90; index += 1) {
        const longitude = 68 + random() * 25
        const latitude = 7 + random() * 27
        nightLights.push({ longitude, latitude, size: random() * 1.45 + 0.45, alpha: random() * 0.45 + 0.5, india: true })
      }
    }

    const drawGlow = (x, y, size, alpha, sprite) => {
      context.globalCompositeOperation = 'lighter'
      context.globalAlpha = alpha
      context.drawImage(sprite, x - size / 2, y - size / 2, size, size)
      context.globalAlpha = 1
      context.globalCompositeOperation = 'source-over'
    }

    const setSize = () => {
      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const backingWidth = Math.round(bounds.width * dpr)
      const backingHeight = Math.round(bounds.height * dpr)
      if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
        canvas.width = backingWidth
        canvas.height = backingHeight
        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        width = bounds.width
        height = bounds.height
      }
    }

    const render = (now) => {
      if (width < 2 || height < 2) {
        setSize()
      }
      if (width >= 2 && height >= 2) {
        const dt = Math.min(64, Math.max(1, now - lastTime))
        lastTime = now
        const frame = dt / 16.6667
        motionPhase += 0.016 * frame
        rotation += 0.0022 * frame

        const centerX = width * 0.72
        const centerY = height * 0.5
        const radius = Math.min(width * 0.86, height * 0.55)

        context.setTransform(Math.min(window.devicePixelRatio || 1, 2), 0, 0, Math.min(window.devicePixelRatio || 1, 2), 0, 0)
        context.clearRect(0, 0, width, height)

        const orbitAngle = motionPhase * 0.18
        context.save()
        context.translate(centerX, centerY)
        context.rotate(orbitAngle)
        context.strokeStyle = 'rgba(106, 227, 222, .18)'
        context.lineWidth = 0.8
        context.setLineDash([2, 9])
        context.beginPath()
        context.ellipse(0, 0, radius * 1.16, radius * 0.28, -0.16, 0, Math.PI * 2)
        context.stroke()
        context.setLineDash([])
        context.restore()

        stars.forEach((star) => {
          context.fillStyle = `rgba(145, 218, 225, ${star.alpha})`
          context.beginPath()
          context.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2)
          context.fill()
        })

        const halo = context.createRadialGradient(centerX, centerY, radius * 0.78, centerX, centerY, radius * 1.28)
        halo.addColorStop(0, 'rgba(49, 180, 191, 0)')
        halo.addColorStop(0.78, 'rgba(75, 216, 220, .08)')
        halo.addColorStop(0.92, 'rgba(94, 235, 226, .16)')
        halo.addColorStop(1, 'rgba(75, 216, 220, 0)')
        context.fillStyle = halo
        context.beginPath()
        context.arc(centerX, centerY, radius * 1.28, 0, Math.PI * 2)
        context.fill()

        const shadow = context.createRadialGradient(centerX - radius * 0.28, centerY - radius * 0.32, radius * 0.08, centerX, centerY, radius * 1.03)
        shadow.addColorStop(0, 'rgba(22, 69, 80, .34)')
        shadow.addColorStop(0.72, 'rgba(4, 20, 31, .58)')
        shadow.addColorStop(1, 'rgba(2, 12, 22, .92)')
        context.fillStyle = shadow
        context.beginPath()
        context.arc(centerX, centerY, radius, 0, Math.PI * 2)
        context.fill()

        const atmosphere = context.createRadialGradient(centerX - radius * 0.2, centerY - radius * 0.25, radius * 0.1, centerX, centerY, radius * 1.1)
        atmosphere.addColorStop(0, 'rgba(32, 82, 97, .24)')
        atmosphere.addColorStop(0.66, 'rgba(7, 25, 38, .08)')
        atmosphere.addColorStop(1, 'rgba(3, 13, 23, 0)')
        context.fillStyle = atmosphere
        context.beginPath()
        context.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2)
        context.fill()

        const sweepPosition = (Math.sin(motionPhase * 0.32) + 1) / 2
        const sweep = context.createLinearGradient(centerX - radius + sweepPosition * radius * 2, centerY - radius, centerX - radius + sweepPosition * radius * 2 + radius * 0.22, centerY + radius)
        sweep.addColorStop(0, 'rgba(135, 255, 237, 0)')
        sweep.addColorStop(0.5, 'rgba(135, 255, 237, .06)')
        sweep.addColorStop(1, 'rgba(135, 255, 237, 0)')
        context.fillStyle = sweep
        context.beginPath()
        context.arc(centerX, centerY, radius - 1, 0, Math.PI * 2)
        context.fill()

        const ocean = context.createRadialGradient(centerX - radius * 0.38, centerY - radius * 0.34, radius * 0.04, centerX, centerY, radius * 1.04)
        ocean.addColorStop(0, 'rgba(25, 75, 91, .38)')
        ocean.addColorStop(0.48, 'rgba(8, 39, 55, .28)')
        ocean.addColorStop(0.8, 'rgba(3, 20, 33, .58)')
        ocean.addColorStop(1, 'rgba(1, 9, 18, .92)')
        context.fillStyle = ocean
        context.beginPath()
        context.arc(centerX, centerY, radius - 1, 0, Math.PI * 2)
        context.fill()

        const terminator = context.createLinearGradient(centerX - radius, centerY - radius * 0.2, centerX + radius, centerY + radius * 0.2)
        terminator.addColorStop(0, 'rgba(2, 13, 24, .44)')
        terminator.addColorStop(0.48, 'rgba(2, 13, 24, .06)')
        terminator.addColorStop(0.7, 'rgba(120, 209, 208, .08)')
        terminator.addColorStop(1, 'rgba(3, 17, 27, .38)')
        context.fillStyle = terminator
        context.beginPath()
        context.arc(centerX, centerY, radius - 1, 0, Math.PI * 2)
        context.fill()

        countryFeatures.forEach(({ geometry }, index) => drawGeometry(geometry, radius, centerX, centerY, countryColors[index % countryColors.length]))

        mapLights.forEach((light) => {
          const point = project(light.lat, light.lon, rotation, radius)
          if (point.depth <= 0) return
          const edgeFade = Math.max(0, 1 - (point.x / radius) ** 2 * 0.18)
          const alpha = light.alpha * edgeFade * 0.72
          const px = centerX + point.x
          const py = centerY + point.y
          drawGlow(px, py, light.size * 3, alpha * 0.5, coolGlow)
          context.fillStyle = `rgba(144, 229, 223, ${alpha})`
          context.beginPath()
          context.arc(px, py, light.size, 0, Math.PI * 2)
          context.fill()
        })

        nightLights.forEach((light) => {
          const point = project(light.latitude, light.longitude, rotation, radius)
          if (point.depth <= 0.05) return
          const depthAlpha = Math.min(1, point.depth * 1.35)
          const pulse = 0.82 + Math.sin(motionPhase * 1.7 + light.longitude * 0.12 + light.latitude) * 0.18
          const indiaBoost = light.india ? 1.55 : 1
          const alpha = light.alpha * depthAlpha * 0.82 * pulse * indiaBoost
          const px = centerX + point.x
          const py = centerY + point.y
          drawGlow(px, py, light.size * 4, Math.min(1, alpha) * 0.7, warmGlow)
          context.fillStyle = light.india ? `rgba(255, 226, 143, ${Math.min(1, alpha)})` : `rgba(255, 210, 135, ${Math.min(1, alpha)})`
          context.beginPath()
          context.arc(px, py, Math.max(0.6, light.size * (0.65 + point.depth * 0.6)), 0, Math.PI * 2)
          context.fill()
        })

        cities.forEach((city) => {
          const { x: rawX, y: rawY, depth } = project(city.lat, city.lon, rotation, radius)
          if (depth <= 0) return
          const cityX = centerX + rawX
          const cityY = centerY + rawY
          const pulse = 0.78 + Math.sin(motionPhase * 2 + city.lon) * 0.22
          drawGlow(cityX, cityY, 24 * pulse + 6, Math.min(1, pulse) * 0.55, warmGlow)
          context.fillStyle = '#fff0b9'
          context.beginPath()
          context.arc(cityX, cityY, 2.1, 0, Math.PI * 2)
          context.fill()
          context.strokeStyle = 'rgba(255, 216, 145, .48)'
          context.lineWidth = 1
          context.beginPath()
          context.arc(cityX, cityY, 5 + Math.sin(motionPhase * 2 + city.lon) * 2, 0, Math.PI * 2)
          context.stroke()
        })

        const haze = context.createRadialGradient(centerX - radius * 0.38, centerY - radius * 0.26, radius * 0.08, centerX, centerY, radius * 0.95)
        haze.addColorStop(0, 'rgba(90, 183, 190, .08)')
        haze.addColorStop(0.58, 'rgba(45, 116, 132, .035)')
        haze.addColorStop(1, 'rgba(0, 0, 0, 0)')
        context.fillStyle = haze
        context.beginPath()
        context.arc(centerX, centerY, radius, 0, Math.PI * 2)
        context.fill()

        context.strokeStyle = 'rgba(154, 255, 246, .42)'
        context.lineWidth = 1.5
        context.beginPath()
        context.arc(centerX, centerY, radius + 1, -Math.PI * 0.58, Math.PI * 0.58)
        context.stroke()
      }
      animationFrame = requestAnimationFrame(render)
    }

    const start = () => {
      if (running) return
      running = true
      lastTime = performance.now()
      animationFrame = requestAnimationFrame(render)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(animationFrame)
    }

    buildScene()
    setSize()
    window.addEventListener('resize', setSize)

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start()
          else stop()
        })
      }, { threshold: 0 })
      observer.observe(canvas)
    } else {
      start()
    }

    return () => {
      stop()
      if (observer) observer.disconnect()
      window.removeEventListener('resize', setSize)
    }
  }, [])

  return <div className="photo-globe"><div className="photo-clouds" /><canvas ref={canvasRef} className="globe-canvas" aria-label="Rotating photographic earth globe" /></div>
}

export default PointGlobe