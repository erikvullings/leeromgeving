import m, { RouteDefs } from 'mithril';
import { IDashboard } from '../models';
import { actions, states } from './meiosis';
import { Layout } from '../components/layout';
import {
  AboutPage,
  DilemmasList,
  dilemmasTemplate,
  DilemmasView,
  HelpPage,
  HomePage,
  LessonsList,
  lessonTemplate,
  LessonView,
  TipsList,
  tipsTemplate,
  TipsView,
} from '../components';
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
  DILEMMAS = 'DILEMMAS',
  DILEMMAS_VIEW = 'DILEMMAS_VIEW',
  DILEMMAS_EDIT = 'DILEMMAS_EDIT',
  TIPS = 'TIPS',
  TIPS_VIEW = 'TIPS_VIEW',
  TIPS_EDIT = 'TIPS_EDIT',
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
    title: 'Best practices',
    icon: 'feedback',
    route: '/les/',
    visible: true,
    component: LessonsList,
  },
  {
    id: Dashboards.LESSON_VIEW,
    title: 'Ervaring',
    icon: 'visibility',
    route: '/les/:id',
    visible: false,
    component: LessonView,
  },
  {
    id: Dashboards.LESSON_EDIT,
    title: 'Ervaring bewerken',
    icon: 'edit',
    route: '/les/bewerken/:id',
    visible: false,
    component: DefaultForm(lessonTemplate, 'lessons', 'les', Dashboards.LESSONS, Dashboards.LESSON_VIEW),
  },
  {
    id: Dashboards.NEWS,
    title: 'Nieuwsberichten',
    icon: 'face',
    route: '/nieuws/',
    visible: true,
    component: NewsList,
  },
  {
    id: Dashboards.NEWS_VIEW,
    title: 'Nieuwsbericht',
    icon: 'visibility',
    route: '/nieuws/:id',
    visible: false,
    component: NewsView,
  },
  {
    id: Dashboards.NEWS_EDIT,
    title: 'Nieuwsbericht bewerken',
    icon: 'edit',
    route: '/nieuws/bewerken/:id',
    visible: false,
    component: DefaultForm(newsTemplate, 'news', 'bericht', Dashboards.NEWS, Dashboards.NEWS_VIEW),
  },
  {
    id: Dashboards.DILEMMAS,
    title: 'Dilemmas',
    icon: 'compare_arrows',
    route: '/dilemma/',
    visible: true,
    component: DilemmasList,
  },
  {
    id: Dashboards.DILEMMAS_VIEW,
    title: 'Dilemma',
    icon: 'visibility',
    route: '/dilemma/:id',
    visible: false,
    component: DilemmasView,
  },
  {
    id: Dashboards.DILEMMAS_EDIT,
    title: 'Dilemma bewerken',
    icon: 'edit',
    route: '/dilemma/bewerken/:id',
    visible: false,
    component: DefaultForm(dilemmasTemplate, 'dilemmas', 'dilemma', Dashboards.DILEMMAS, Dashboards.DILEMMAS_VIEW),
  },
  {
    id: Dashboards.TIPS,
    title: 'Tips & Tricks',
    icon: 'lightbulb_outline',
    route: '/tip/',
    visible: true,
    component: TipsList,
  },
  {
    id: Dashboards.TIPS_VIEW,
    title: 'Tip',
    icon: 'visibility',
    route: '/tip/:id',
    visible: false,
    component: TipsView,
  },
  {
    id: Dashboards.TIPS_EDIT,
    title: 'Tip bewerken',
    icon: 'edit',
    route: '/tip/bewerken/:id',
    visible: false,
    component: DefaultForm(tipsTemplate, 'tips', 'tip', Dashboards.TIPS, Dashboards.TIPS_VIEW),
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
