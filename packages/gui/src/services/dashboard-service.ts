import m, { RouteDefs } from 'mithril';
import { IDashboard } from '../models';
import { actions, states } from './meiosis';
import { Layout } from '../components/layout';
import {
  AboutPage,
  DilemmasList,
  dilemmasTemplate,
  DilemmasView,
  HomePage,
  IssuesList,
  issuesTemplate,
  IssuesView,
  LessonsList,
  lessonTemplate,
  LessonView,
  TipsList,
  scenarioTemplate,
  TipsView,
  NewsList,
  newsTemplate,
  NewsView,
  ScenarioList,
  ScenarioView,
} from '../components';
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
  ISSUES = 'ISSUES',
  ISSUES_VIEW = 'ISSUES_VIEW',
  ISSUES_EDIT = 'ISSUES_EDIT',
  SCENARIOS = 'SCENARIOS',
  SCENARIOS_VIEW = 'SCENARIOS_VIEW',
  SCENARIOS_EDIT = 'SCENARIOS_EDIT',
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
    visible: false,
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
    icon: 'chat',
    route: '/nieuws/',
    visible: false,
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
    title: 'Quiz',
    icon: 'compare_arrows',
    route: '/quiz/',
    visible: false,
    component: DilemmasList,
  },
  {
    id: Dashboards.DILEMMAS_VIEW,
    title: 'Quiz',
    icon: 'visibility',
    route: '/quiz/:id',
    visible: false,
    component: DilemmasView,
  },
  {
    id: Dashboards.DILEMMAS_EDIT,
    title: 'Quiz bewerken',
    icon: 'edit',
    route: '/quiz/bewerken/:id',
    visible: false,
    component: DefaultForm(dilemmasTemplate, 'dilemmas', 'quizvraag', Dashboards.DILEMMAS, Dashboards.DILEMMAS_VIEW),
  },
  {
    id: Dashboards.TIPS,
    title: 'Tips & Tricks',
    icon: 'lightbulb_outline',
    route: '/tip/',
    visible: false,
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
    component: DefaultForm(scenarioTemplate, 'tips', 'tip', Dashboards.TIPS, Dashboards.TIPS_VIEW),
  },
  {
    id: Dashboards.ISSUES,
    title: 'Vragen',
    icon: 'live_help',
    route: '/vraag/',
    visible: false,
    component: IssuesList,
  },
  {
    id: Dashboards.ISSUES_VIEW,
    title: 'Vraag',
    icon: 'visibility',
    route: '/vraag/:id',
    visible: false,
    component: IssuesView,
  },
  {
    id: Dashboards.ISSUES_EDIT,
    title: 'Vraag bewerken',
    icon: 'edit',
    route: '/vraag/bewerken/:id',
    visible: false,
    component: DefaultForm(issuesTemplate, 'issues', 'vraag', Dashboards.ISSUES, Dashboards.ISSUES_VIEW),
  },
  {
    id: Dashboards.SCENARIOS,
    title: 'Draaiboeken',
    icon: 'local_movies',
    route: '/draaiboek/',
    visible: false,
    component: ScenarioList,
  },
  {
    id: Dashboards.SCENARIOS_VIEW,
    title: 'Draaiboek',
    icon: 'visibility',
    route: '/draaiboek/:id',
    visible: false,
    component: ScenarioView,
  },
  {
    id: Dashboards.SCENARIOS_EDIT,
    title: 'Draaiboek bewerken',
    icon: 'edit',
    route: '/draaiboek/bewerken/:id',
    visible: false,
    component: DefaultForm(scenarioTemplate, 'scenarios', 'draaiboek', Dashboards.SCENARIOS, Dashboards.SCENARIOS_VIEW),
  },
  {
    id: Dashboards.ABOUT,
    title: 'OVER',
    icon: 'info',
    route: '/about',
    visible: true,
    component: AboutPage,
  },
]);
