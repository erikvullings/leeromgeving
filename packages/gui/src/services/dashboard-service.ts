import m, { RouteDefs } from 'mithril';
import { IDashboard } from '../models';
import { actions, states } from './meiosis';
import { Layout } from '../components/layout';
import { AboutPage, HelpPage, HomePage, LessonsList, LessonForm } from '../components';

export const enum Dashboards {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  HELP = 'HELP',
  OVERVIEW = 'LIST',
  EDIT = 'EDIT',
  USER = 'USER',
  LESSONS = 'LESSONS',
  LESSONS_DETAILS = 'LESSONS_DETAILS',
  NEWS = 'NEWS',
  NEWS_DETAILS = 'NEWS_DETAILS',
  TIPS = 'TIPS',
  TIPS_DETAILS = 'TIPS_DETAILS',
  SCENARIOS = 'SCENARIOS',
  SCENARIOS_DETAILS = 'SCENARIOS_DETAILS',
}

class DashboardService {
  private dashboards!: ReadonlyArray<IDashboard>;

  constructor(dashboards: IDashboard[]) {
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
    console.log('INIT');
    return this.dashboards.reduce((p, c) => {
      p[c.route] =
        c.hasNavBar === false
          ? {
              render: () => m(c.component, { state: states(), actions: actions }),
            }
          : {
              render: () =>
                m(
                  Layout,
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

export const dashboardSvc: DashboardService = new DashboardService([
  {
    id: Dashboards.OVERVIEW,
    title: 'OVERZICHT',
    icon: 'home',
    route: '/overzicht',
    visible: true,
    component: HelpPage, // TODO replace with dashboard view, showing newest items of all collections
  },
  {
    id: Dashboards.LESSONS,
    title: 'Lessons-learnt',
    icon: 'forum',
    route: '/les/',
    visible: true,
    component: LessonsList,
  },
  {
    id: Dashboards.LESSONS_DETAILS,
    title: 'Lessons-learnt',
    icon: 'book',
    route: '/les/:id',
    visible: false,
    component: LessonForm,
  },
  {
    id: Dashboards.EDIT,
    title: 'BEWERKEN',
    icon: 'edit',
    route: '/bewerken/:id',
    visible: false,
    component: LessonForm,
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
    icon: 'home',
    default: true,
    hasNavBar: false,
    title: 'HOME',
    route: '/',
    visible: false,
    component: HomePage,
  },
]);
