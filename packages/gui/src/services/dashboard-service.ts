import m, { RouteDefs } from 'mithril';
import { IDashboard } from '../models';
import { actions, states, MeiosisComponent } from './meiosis';
import { ItemView, AboutPage, HelpPage, HomePage, Layout, ItemList, ItemForm } from '../components';

export const enum Dashboards {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  HELP = 'HELP',
  LIST = 'LIST',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  USER = 'USER',
}

class DashboardService {
  private dashboards!: ReadonlyArray<IDashboard>;

  constructor(private layout: MeiosisComponent, dashboards: IDashboard[]) {
    this.setList(dashboards);
  }

  public getList() {
    return this.dashboards;
  }

  public setList(list: IDashboard[]) {
    this.dashboards = Object.freeze(list);
  }

  public get defaultRoute() {
    const dashboard = this.dashboards.filter((d) => d.default).shift();
    return dashboard ? dashboard.route : this.dashboards[0].route;
  }

  public route(dashboardId: Dashboards) {
    const dashboard = this.dashboards.filter((d) => d.id === dashboardId).shift();
    return dashboard ? dashboard.route : this.defaultRoute;
  }

  public switchTo(
    dashboardId: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) {
    const dashboard = this.dashboards.filter((d) => d.id === dashboardId).shift();
    if (dashboard) {
      const url = dashboard.route + (query ? '?' + m.buildQueryString(query) : '');
      console.log(url);
      m.route.set(url, params);
    }
  }

  public routingTable() {
    return this.dashboards.reduce((p, c) => {
      p[c.route] =
        c.hasNavBar === false
          ? {
              render: () => m(c.component, { state: states(), actions: actions }),
            }
          : {
              render: () =>
                m(
                  this.layout,
                  { state: states(), actions: actions },
                  m(c.component, {
                    state: states(),
                    actions: actions,
                  })
                ),
            };
      return p;
    }, {} as RouteDefs);
  }
}

export const dashboardSvc: DashboardService = new DashboardService(Layout, [
  {
    id: Dashboards.LIST,
    title: 'OVERZICHT',
    icon: 'home',
    route: '/overzicht',
    visible: true,
    component: ItemList,
  },
  {
    id: Dashboards.VIEW,
    title: 'BOB-view',
    // hasNavBar: false,
    icon: 'dashboard',
    route: '/bob/:id',
    visible: false,
    component: ItemView,
  },
  {
    id: Dashboards.EDIT,
    title: 'BEWERKEN',
    icon: 'edit',
    route: '/bewerken/:id',
    visible: false,
    component: ItemForm,
  },
  {
    id: Dashboards.ABOUT,
    title: 'OVER',
    icon: 'info',
    route: '/about',
    visible: true,
    component: AboutPage,
  },
  {
    id: Dashboards.HELP,
    title: 'HELP',
    icon: 'help',
    route: '/help',
    visible: true,
    component: HelpPage,
  },
  {
    id: Dashboards.HOME,
    default: true,
    hasNavBar: false,
    title: 'HOME',
    route: '/',
    visible: false,
    component: HomePage,
  },
]);
