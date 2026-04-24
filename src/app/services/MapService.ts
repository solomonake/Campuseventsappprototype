/**
 * Map Service
 *
 * RISK MITIGATION (R3 - Map Integration Failure):
 * ==============================================
 * This service separates map-specific logic from the main EventService
 * to prevent map failures from breaking the event feed.
 *
 * Separation Benefits:
 * 1. Map rendering errors don't affect event list
 * 2. Can test map logic independently
 * 3. Easy to swap map providers (Google Maps, Leaflet, Mapbox)
 * 4. Graceful degradation if map service unavailable
 *
 * Contract Testing:
 * - MapService must provide consistent interface
 * - EventService depends only on contract, not implementation
 * - Changes to map provider don't break event features
 *
 * @module services/MapService
 */

import { Event, Location } from "../types/models";

/**
 * Map Pin Data
 *
 * Simplified representation of an event for map display
 */
export interface MapPin {
  id: string;
  title: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  eventDate: string;
  creditEligible: boolean;
}

/**
 * Map Bounds
 *
 * Geographic bounds for map viewport
 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * MapService Class
 *
 * Handles all map-related operations.
 * Isolated from EventService to prevent coupling.
 */
export class MapService {
  /**
   * Convert Events to Map Pins
   *
   * Transforms event data into simplified map pin format.
   * Prevents map component from depending on full Event structure.
   *
   * CONTRACT: This method signature should remain stable.
   * Map component depends on MapPin interface, not Event interface.
   *
   * @param events - Events to convert
   * @returns MapPin[] - Simplified pin data
   */
  eventsToMapPins(events: Event[]): MapPin[] {
    try {
      return events.map(event => ({
        id: event.id,
        title: event.title,
        coordinates: event.location.coordinates,
        locationName: event.location.name,
        eventDate: event.datetime,
        creditEligible: event.creditEligible,
      }));
    } catch (error) {
      // FAULT ISOLATION: Map conversion errors don't crash app
      console.error("[MapService] Error converting events to pins:", error);
      return [];
    }
  }

  /**
   * Calculate Map Bounds
   *
   * Determines viewport bounds to fit all event pins.
   * Returns default campus bounds if calculation fails.
   *
   * GRACEFUL DEGRADATION: Falls back to default bounds on error.
   *
   * @param pins - Map pins to include
   * @returns MapBounds - Calculated or default bounds
   */
  calculateBounds(pins: MapPin[]): MapBounds {
    try {
      if (pins.length === 0) {
        return this.getDefaultBounds();
      }

      let north = -Infinity;
      let south = Infinity;
      let east = -Infinity;
      let west = Infinity;

      pins.forEach(pin => {
        north = Math.max(north, pin.coordinates.lat);
        south = Math.min(south, pin.coordinates.lat);
        east = Math.max(east, pin.coordinates.lng);
        west = Math.min(west, pin.coordinates.lng);
      });

      // Add padding (10% margin)
      const latPadding = (north - south) * 0.1;
      const lngPadding = (east - west) * 0.1;

      return {
        north: north + latPadding,
        south: south - latPadding,
        east: east + lngPadding,
        west: west - lngPadding,
      };
    } catch (error) {
      console.error("[MapService] Error calculating bounds:", error);
      return this.getDefaultBounds();
    }
  }

  /**
   * Get Default Bounds
   *
   * Returns default campus map bounds.
   * Used as fallback when calculation fails.
   *
   * TODO: Update these coordinates to match actual campus
   *
   * @returns MapBounds - Default UVA-Wise campus bounds
   */
  getDefaultBounds(): MapBounds {
    return {
      north: 38.040,
      south: 38.030,
      east: -78.495,
      west: -78.510,
    };
  }

  /**
   * Calculate Map Center
   *
   * Finds center point of all event pins.
   * Falls back to campus center if calculation fails.
   *
   * @param pins - Map pins to center on
   * @returns { lat: number; lng: number } - Center coordinates
   */
  calculateCenter(pins: MapPin[]): { lat: number; lng: number } {
    try {
      if (pins.length === 0) {
        return this.getDefaultCenter();
      }

      const avgLat = pins.reduce((sum, pin) => sum + pin.coordinates.lat, 0) / pins.length;
      const avgLng = pins.reduce((sum, pin) => sum + pin.coordinates.lng, 0) / pins.length;

      return { lat: avgLat, lng: avgLng };
    } catch (error) {
      console.error("[MapService] Error calculating center:", error);
      return this.getDefaultCenter();
    }
  }

  /**
   * Get Default Center
   *
   * Returns default campus center coordinates.
   *
   * @returns { lat: number; lng: number } - Default center
   */
  getDefaultCenter(): { lat: number; lng: number } {
    return {
      lat: 38.0356,
      lng: -78.5034,
    };
  }

  /**
   * Generate Directions URL
   *
   * Creates Google Maps directions URL to event location.
   *
   * SCOPE NOTE (R6): This is the ONLY routing feature.
   * Do NOT implement turn-by-turn, distance calculation, etc.
   *
   * @param location - Event location
   * @returns string - Google Maps URL
   */
  getDirectionsUrl(location: Location): string {
    const { lat, lng } = location.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  /**
   * Validate Coordinates
   *
   * Checks if coordinates are valid geographic values.
   * Prevents map rendering errors from invalid data.
   *
   * @param lat - Latitude
   * @param lng - Longitude
   * @returns boolean - True if valid
   */
  validateCoordinates(lat: number, lng: number): boolean {
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      !isNaN(lat) &&
      !isNaN(lng)
    );
  }

  /**
   * Filter Pins by Bounds
   *
   * Returns only pins within specified bounds.
   * Used for viewport culling in map rendering.
   *
   * @param pins - All pins
   * @param bounds - Viewport bounds
   * @returns MapPin[] - Pins within bounds
   */
  filterPinsByBounds(pins: MapPin[], bounds: MapBounds): MapPin[] {
    try {
      return pins.filter(pin =>
        pin.coordinates.lat <= bounds.north &&
        pin.coordinates.lat >= bounds.south &&
        pin.coordinates.lng <= bounds.east &&
        pin.coordinates.lng >= bounds.west
      );
    } catch (error) {
      console.error("[MapService] Error filtering pins:", error);
      return pins; // Return all pins on error
    }
  }
}

/**
 * Contract Tests (R3 Mitigation)
 *
 * These tests verify MapService provides stable interface.
 * Run these tests before deploying any MapService changes.
 *
 * Example Contract Tests:
 *
 * ```typescript
 * describe('MapService Contract', () => {
 *   test('eventsToMapPins returns array', () => {
 *     const mapService = new MapService();
 *     const result = mapService.eventsToMapPins([]);
 *     expect(Array.isArray(result)).toBe(true);
 *   });
 *
 *   test('eventsToMapPins handles invalid input gracefully', () => {
 *     const mapService = new MapService();
 *     expect(() => mapService.eventsToMapPins(null)).not.toThrow();
 *   });
 *
 *   test('getDirectionsUrl returns string', () => {
 *     const mapService = new MapService();
 *     const url = mapService.getDirectionsUrl({
 *       id: '1',
 *       name: 'Test',
 *       coordinates: { lat: 38, lng: -78 }
 *     });
 *     expect(typeof url).toBe('string');
 *   });
 * });
 * ```
 */
