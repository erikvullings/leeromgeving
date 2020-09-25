import m, { RouteDefs } from 'mithril';
import { IDashboard } from '../models';
import { actions, states } from './meiosis';
import { Layout } from '../components/layout';
import { AboutPage, HelpPage, HomePage, LessonsList, lessonTemplate, LessonView } from '../components';
import { NewsList, newsTemplate, NewsView } from '../components/collections/news';
import { DefaultForm } from '../components/ui';

export const enum Dashboards {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  HELP = 'HELP',
  OVERVIEW = 'LIST',
  EDIT = 'EDIT',
  USER = 'USER',
  LESSONS = 'LESSONS',
  LESSON_VIEW = 'LESSON_VIEW',
  LESSON_EDIT = 'LESSON_EDIT',
  NEWS = 'NEWS',
  NEWS_VIEW = 'NEWS_VIEW',
  NEWS_EDIT = 'NEWS_EDIT',
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
    route: '/',
    visible: true,
    component: HomePage, // TODO replace with dashboard view, showing newest items of all collections
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
    id: Dashboards.LESSON_VIEW,
    title: 'Best practice',
    icon: 'visibility',
    route: '/les/:id',
    visible: false,
    component: LessonView,
  },
  {
    id: Dashboards.LESSON_EDIT,
    title: 'Bewerken',
    icon: 'edit',
    route: '/les/bewerken/:id',
    visible: false,
    component: DefaultForm(lessonTemplate, 'lessons', 'les', Dashboards.LESSONS, Dashboards.LESSON_VIEW),
  },
  {
    id: Dashboards.NEWS,
    title: 'Niewsberichten',
    icon: 'people',
    route: '/nieuws/',
    visible: true,
    component: NewsList,
  },
  {
    id: Dashboards.NEWS_VIEW,
    title: 'Niewsbericht',
    icon: 'visibility',
    route: '/nieuws/:id',
    visible: false,
    component: NewsView,
  },
  {
    id: Dashboards.NEWS_EDIT,
    title: 'Niewsbericht',
    icon: 'edit',
    route: '/nieuws/bewerken/:id',
    visible: false,
    component: DefaultForm(newsTemplate, 'news', 'bericht', Dashboards.NEWS, Dashboards.NEWS_VIEW),
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
  // {
  //   id: Dashboards.HOME,
  //   icon: 'home',
  //   default: true,
  //   hasNavBar: false,
  //   title: 'HOME',
  //   route: '/',
  //   visible: false,
  //   component: HomePage,
  // },
]);
