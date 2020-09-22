/** During development, use this URL to access the server. */
export const apiService = () => process.env.SERVER || window.location.origin; // `http://localhost:${process.env.LOKI_PORT}/`;

import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';
import m from 'mithril';
import './css/humanitarian-icons.css';
import './css/style.css';
import { dashboardSvc } from './services/dashboard-service';
import L from 'leaflet';

declare var require: any;

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

m.route(document.body, dashboardSvc.defaultRoute, dashboardSvc.routingTable());
