import m from 'mithril';
import { Icon } from 'mithril-materialized';
import logo from '../assets/logo.svg';
import { IDashboard } from '../models';
import { dashboardSvc } from '../services/dashboard-service';
import { MeiosisComponent } from '../services';

const stripRouteParams = (path: string) => path.replace(/:[a-zA-Z]+/, '');

const isActiveRoute = (route = m.route.get()) => (path: string) =>
  path.length > 1 && route.indexOf(stripRouteParams(path)) >= 0 ? '.active' : '';

export const Layout: MeiosisComponent = () => ({
  view: ({ children }) => {
    const isActive = isActiveRoute();
    return m('.main', [
      m(
        '.navbar-fixed',
        { style: 'z-index: 1001' },
        m(
          'nav',
          m('.nav-wrapper', [
            m('a.brand-logo[href=#].hide-on-small-and-down', { style: 'margin-left: 20px' }, [
              m(`img[width=100][height=50][src=${logo}]`, {
                style: 'margin-top: 5px; margin-left: -5px;',
              }),
              m(
                'div',
                {
                  style:
                    'margin-top: 0px; position: absolute; top: 10px; left: 120px; width: 600px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; height: 40px;',
                },
                m('h4.center.hide-on-med-and-down.black-text', { style: 'text-align: left; margin: 0;' }, 'TITLE')
              ),
            ]),
            m(
              // 'a.sidenav-trigger[href=#!/home][data-target=slide-out]',
              // { onclick: (e: UIEvent) => e.preventDefault() },
              m.route.Link,
              {
                className: 'sidenav-trigger',
                'data-target': 'slide-out',
                href: m.route.get(),
              },
              m(Icon, {
                iconName: 'menu',
                className: 'hide-on-med-and-up black-text',
                style: 'margin-left: 5px;',
              })
            ),
            m(
              'ul.right',
              dashboardSvc
                .getList()
                .filter((d) => d.icon && d.visible)
                .map((d: IDashboard) =>
                  m(
                    `li${isActive(d.route)}`,
                    m(
                      m.route.Link,
                      {
                        href: d.route,
                        // href: id ? d.route.replace(':id', id.toString()) : d.route,
                      },
                      m(
                        'span',
                        d.icon ? m('i.material-icons', typeof d.icon === 'string' ? d.icon : d.icon()) : d.title
                      )
                    )
                  )
                )
            ),
          ])
        )
      ),
      m('.container', children),
    ]);
  },
});
