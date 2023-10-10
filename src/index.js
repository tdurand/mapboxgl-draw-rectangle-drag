import createRectangle from "./utils/create-rectangle";
import { enableZoom, disableZoom } from "./utils/zoom";
import turfDistance from "@turf/distance";
import turfDestination from "@turf/destination";
import turfBearing from "@turf/bearing";

const DrawRectangleDrag = {
  onSetup() {
    const rectangle = this.newFeature(createRectangle());
    this.addFeature(rectangle);

    this.clearSelectedFeatures();

    // UI Tweaks
    this.updateUIClasses({ mouse: "add" });
    this.setActionableState({ trash: true });
    disableZoom(this);

    this.isSquareMode = false;

    return { rectangle };
  },

  onMouseDown(state, event) {
    event.preventDefault();
    this.onMouseDownOrTouchStart(state, event);
  },

  onTouchStart(state, event) {
    event.preventDefault();
    this.onMouseDownOrTouchStart(state, event);
  },

  onMouseMove(state, event) {
    if (!state.startPoint) {
      return;
    }

    this.updateDrawingWhileDraggingOrMouseMove(state, event);
  },

  onDrag(state, event) {
    if (!state.startPoint) {
      return;
    }

    this.updateDrawingWhileDraggingOrMouseMove(state, event);
  },

  onMouseUp(state, event) {
    this.finishDrawing(state, event);
  },

  onTouchEnd(state, event) {
    this.finishDrawing(state, event);
  },

  onStop(state) {
    enableZoom(this);
    this.updateUIClasses({ mouse: "none" });

    if (!this.getFeature(state.rectangle.id)) {
      return;
    }

    // Remove latest coordinate
    state.rectangle.removeCoordinate("0.4");

    if (state.rectangle.isValid()) {
      this.map.fire("draw.create", {
        features: [state.rectangle.toGeoJSON()],
      });
      return;
    }

    this.deleteFeature([state.rectangle.id], { silent: true });
    this.changeMode("simple_select", {}, { silent: true });
  },

  onTrash(state) {
    this.deleteFeature([state.rectangle.id], { silent: true });
    this.changeMode("simple_select");
  },

  onKeyUp(state, e) {
    if (e.keyCode === 27) return this.onTrash(state);
    if (e.keyCode === 16) {
      this.isSquareMode = false;
    }
  },

  onKeyDown(state, e) {
    if (e.keyCode === 16) {
      this.isSquareMode = true;
    }
  },

  updateDrawingWhileDraggingOrMouseMove(state, event) {
    if (this.isSquareMode) {
      const westEastDistance = turfDistance(
        state.startPoint,
        [event.lngLat.lng, state.startPoint[1]],
        {
          units: "kilometers",
        }
      );

      const southNorthDistance = turfDistance(
        state.startPoint,
        [state.startPoint[0], event.lngLat.lat],
        {
          units: "kilometers",
        }
      );

      const bearing = turfBearing(state.startPoint, [
        event.lngLat.lng,
        event.lngLat.lat,
      ]);

      if (westEastDistance > southNorthDistance) {
        const computedPointOnTheSouthNorthBearing = turfDestination(
          state.startPoint,
          westEastDistance,
          bearing + 90 < 180 && bearing + 90 > 0 ? 0 : 180,
          {
            units: "kilometers",
          }
        ).geometry.coordinates;

        state.rectangle.updateCoordinate(
          "0.1",
          event.lngLat.lng,
          state.startPoint[1]
        );

        state.rectangle.updateCoordinate(
          "0.2",
          event.lngLat.lng,
          computedPointOnTheSouthNorthBearing[1]
        );

        state.rectangle.updateCoordinate(
          "0.3",
          state.startPoint[0],
          computedPointOnTheSouthNorthBearing[1]
        );
      } else {
        const computedPointOnTheWestEastBearing = turfDestination(
          state.startPoint,
          southNorthDistance,
          bearing > 0 ? 90 : 270,
          {
            units: "kilometers",
          }
        ).geometry.coordinates;

        state.rectangle.updateCoordinate(
          "0.1",
          computedPointOnTheWestEastBearing[0],
          state.startPoint[1]
        );

        state.rectangle.updateCoordinate(
          "0.2",
          computedPointOnTheWestEastBearing[0],
          event.lngLat.lat
        );

        state.rectangle.updateCoordinate(
          "0.3",
          state.startPoint[0],
          event.lngLat.lat
        );
      }

      // Starting point again
      state.rectangle.updateCoordinate(
        "0.4",
        state.startPoint[0],
        state.startPoint[1]
      );
    } else {
      // Upper right vertex - maxX, minY
      state.rectangle.updateCoordinate(
        "0.1",
        event.lngLat.lng,
        state.startPoint[1]
      );

      // Lower right vertex - maxX, maxY
      state.rectangle.updateCoordinate(
        "0.2",
        event.lngLat.lng,
        event.lngLat.lat
      );

      // Lower left vertex - minX, maxY
      state.rectangle.updateCoordinate(
        "0.3",
        state.startPoint[0],
        event.lngLat.lat
      );

      // Starting point again
      state.rectangle.updateCoordinate(
        "0.4",
        state.startPoint[0],
        state.startPoint[1]
      );
    }
  },

  onMouseDownOrTouchStart(state, event) {
    // If we are already dragging, finish the rectangle
    if (state.startPoint) {
      this.finishDrawing(state, event);
    } else {
      // Else setup the starting point, we start the drawing
      const startPoint = [event.lngLat.lng, event.lngLat.lat];
      state.startPoint = startPoint;

      // Starting point - minX,minY
      state.rectangle.updateCoordinate(
        "0.0",
        state.startPoint[0],
        state.startPoint[1]
      );
    }
  },

  finishDrawing(state, event) {
    state.endPoint = [event.lngLat.lng, event.lngLat.lat];

    this.updateUIClasses({ mouse: "pointer" });
    this.changeMode("simple_select", { featuresId: state.rectangle.id });
  },

  toDisplayFeatures(state, geojson, display) {
    const isActivePolygon = geojson.properties.id === state.rectangle.id;
    geojson.properties.active = isActivePolygon.toString();

    if (!isActivePolygon) {
      display(geojson);
      return;
    }

    if (!state.startPoint) {
      return;
    }

    display(geojson);
  },
};

export default DrawRectangleDrag;
