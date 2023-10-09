var t={centimeters:637100880,centimetres:637100880,degrees:6371008.8/111325,feet:20902260.511392,inches:6371008.8*39.37,kilometers:6371.0088,kilometres:6371.0088,meters:6371008.8,metres:6371008.8,miles:3958.761333810546,millimeters:6371008800,millimetres:6371008800,nauticalmiles:6371008.8/1852,radians:1,yards:6371008.8*1.0936};function e(t){return 180*(t%(2*Math.PI))/Math.PI}function r(t){return t%360*Math.PI/180}function a(t){return!isNaN(t)&&null!==t&&!Array.isArray(t)}function n(t){if(!t)throw new Error("coord is required");if(!Array.isArray(t)){if("Feature"===t.type&&null!==t.geometry&&"Point"===t.geometry.type)return t.geometry.coordinates;if("Point"===t.type)return t.coordinates}if(Array.isArray(t)&&t.length>=2&&!Array.isArray(t[0])&&!Array.isArray(t[1]))return t;throw new Error("coord must be GeoJSON Point or an Array of numbers")}function o(e,a,o){void 0===o&&(o={});var i=n(e),s=n(a),l=r(s[1]-i[1]),u=r(s[0]-i[0]),d=r(i[1]),c=r(s[1]),h=Math.pow(Math.sin(l/2),2)+Math.pow(Math.sin(u/2),2)*Math.cos(d)*Math.cos(c);return function(e,r){void 0===r&&(r="kilometers");var a=t[r];if(!a)throw new Error(r+" units is invalid");return e*a}(2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h)),o.units)}function i(o,i,s,l){void 0===l&&(l={});var u=n(o),d=r(u[0]),c=r(u[1]),h=r(s),g=function(e,r){void 0===r&&(r="kilometers");var a=t[r];if(!a)throw new Error(r+" units is invalid");return e/a}(i,l.units),p=Math.asin(Math.sin(c)*Math.cos(g)+Math.cos(c)*Math.sin(g)*Math.cos(h));return function(t,e,r){if(void 0===r&&(r={}),!t)throw new Error("coordinates is required");if(!Array.isArray(t))throw new Error("coordinates must be an Array");if(t.length<2)throw new Error("coordinates must be at least 2 numbers long");if(!a(t[0])||!a(t[1]))throw new Error("coordinates must contain numbers");return function(t,e,r){void 0===r&&(r={});var a={type:"Feature"};return(0===r.id||r.id)&&(a.id=r.id),r.bbox&&(a.bbox=r.bbox),a.properties=e||{},a.geometry=t,a}({type:"Point",coordinates:t},e,r)}([e(d+Math.atan2(Math.sin(h)*Math.sin(g)*Math.cos(c),Math.cos(g)-Math.sin(c)*Math.sin(p))),e(p)],l.properties)}function s(t,a,o){if(void 0===o&&(o={}),!0===o.final)return function(t,e){var r=s(e,t);return r=(r+180)%360}(t,a);var i=n(t),l=n(a),u=r(i[0]),d=r(l[0]),c=r(i[1]),h=r(l[1]),g=Math.sin(d-u)*Math.cos(h),p=Math.cos(c)*Math.sin(h)-Math.sin(c)*Math.cos(h)*Math.cos(d-u);return e(Math.atan2(g,p))}export default{onSetup(){const t=this.newFeature({type:"Feature",properties:{},geometry:{type:"Polygon",coordinates:[[]]}});var e;return this.addFeature(t),this.clearSelectedFeatures(),this.updateUIClasses({mouse:"add"}),this.setActionableState({trash:!0}),e=this,setTimeout(()=>{const{map:t}=e,r=t&&t.doubleClickZoom;t&&r&&r.disable()},0),this.isSquareMode=!1,{rectangle:t}},onMouseDown(t,e){e.preventDefault(),this.onMouseDownOrTouchStart(t,e)},onTouchStart(t,e){e.preventDefault(),this.onMouseDownOrTouchStart(t,e)},onMouseMove(t,e){t.startPoint&&this.updateDrawingWhileDraggingOrMouseMove(t,e)},onDrag(t,e){console.log("onDrag"),t.startPoint&&this.updateDrawingWhileDraggingOrMouseMove(t,e)},onMouseUp(t,e){this.finishDrawing(t,e)},onStop(t){var e;e=this,setTimeout(()=>{const t=e._ctx&&e._ctx.store,r=e.map&&e.map;(r||t.getInitialValue)&&t.getInitialConfigValue("doubleClickZoom")&&r.doubleClickZoom.enable()},0),this.updateUIClasses({mouse:"none"}),this.getFeature(t.rectangle.id)&&(t.rectangle.removeCoordinate("0.4"),t.rectangle.isValid()?this.map.fire("draw.create",{features:[t.rectangle.toGeoJSON()]}):(this.deleteFeature([t.rectangle.id],{silent:!0}),this.changeMode("simple_select",{},{silent:!0})))},onTrash(t){this.deleteFeature([t.rectangle.id],{silent:!0}),this.changeMode("simple_select")},onKeyUp(t,e){if(27===e.keyCode)return this.onTrash(t);16===e.keyCode&&(this.isSquareMode=!1)},onKeyDown(t,e){16===e.keyCode&&(this.isSquareMode=!0)},updateDrawingWhileDraggingOrMouseMove(t,e){if(this.isSquareMode){const r=o(t.startPoint,[e.lngLat.lng,t.startPoint[1]],{units:"kilometers"}),a=o(t.startPoint,[t.startPoint[0],e.lngLat.lat],{units:"kilometers"}),n=s(t.startPoint,[e.lngLat.lng,e.lngLat.lat]);if(r>a){const a=i(t.startPoint,r,n+90<180&&n+90>0?0:180,{units:"kilometers"}).geometry.coordinates;t.rectangle.updateCoordinate("0.1",e.lngLat.lng,t.startPoint[1]),t.rectangle.updateCoordinate("0.2",e.lngLat.lng,a[1]),t.rectangle.updateCoordinate("0.3",t.startPoint[0],a[1])}else{const r=i(t.startPoint,a,n>0?90:270,{units:"kilometers"}).geometry.coordinates;t.rectangle.updateCoordinate("0.1",r[0],t.startPoint[1]),t.rectangle.updateCoordinate("0.2",r[0],e.lngLat.lat),t.rectangle.updateCoordinate("0.3",t.startPoint[0],e.lngLat.lat)}t.rectangle.updateCoordinate("0.4",t.startPoint[0],t.startPoint[1])}else t.rectangle.updateCoordinate("0.1",e.lngLat.lng,t.startPoint[1]),t.rectangle.updateCoordinate("0.2",e.lngLat.lng,e.lngLat.lat),t.rectangle.updateCoordinate("0.3",t.startPoint[0],e.lngLat.lat),t.rectangle.updateCoordinate("0.4",t.startPoint[0],t.startPoint[1])},onMouseDownOrTouchStart(t,e){if(t.startPoint)this.finishDrawing(t,e);else{const r=[e.lngLat.lng,e.lngLat.lat];t.startPoint=r,t.rectangle.updateCoordinate("0.0",t.startPoint[0],t.startPoint[1])}},finishDrawing(t,e){t.endPoint=[e.lngLat.lng,e.lngLat.lat],this.updateUIClasses({mouse:"pointer"}),this.changeMode("simple_select",{featuresId:t.rectangle.id})},toDisplayFeatures(t,e,r){const a=e.properties.id===t.rectangle.id;e.properties.active=a.toString(),a?t.startPoint&&r(e):r(e)}};
