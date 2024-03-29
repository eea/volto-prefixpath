/**
 * Controlpanels component.
 * @module components/manage/Controlpanels/Controlpanels
 */

import { concat, filter, last, map, sortBy, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { Portal } from 'react-portal';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { Container, Grid, Header, Message, Segment } from 'semantic-ui-react';

import { getSystemInformation, listControlpanels } from '@plone/volto/actions';
import { Helmet, asyncConnect } from '@plone/volto/helpers';
import {
  Error,
  Icon,
  Toolbar,
  VersionOverview,
  UniversalLink,
} from '@plone/volto/components';

import config from '@plone/volto/registry';

import backSVG from '@plone/volto/icons/back.svg';

const messages = defineMessages({
  sitesetup: {
    id: 'Site Setup',
    defaultMessage: 'Site Setup',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  versionoverview: {
    id: 'Version Overview',
    defaultMessage: 'Version Overview',
  },
  general: {
    id: 'General',
    defaultMessage: 'General',
  },
  addonconfiguration: {
    id: 'Add-on Configuration',
    defaultMessage: 'Add-on Configuration',
  },
  content: {
    id: 'Content',
    defaultMessage: 'Content',
  },
  moderatecomments: {
    id: 'Moderate Comments',
    defaultMessage: 'Moderate Comments',
  },
  usersandgroups: {
    id: 'Users and Groups',
    defaultMessage: 'Users and Groups',
  },
  usersControlPanelCategory: {
    id: 'Users',
    defaultMessage: 'Users',
  },
  users: {
    id: 'Users',
    defaultMessage: 'Users',
  },
  groups: {
    id: 'Groups',
    defaultMessage: 'Groups',
  },
  addons: {
    id: 'Add-Ons',
    defaultMessage: 'Add-Ons',
  },
  database: {
    id: 'Database',
    defaultMessage: 'Database',
  },
  usergroupmemberbership: {
    id: 'User Group Membership',
    defaultMessage: 'User Group Membership',
  },
  undo: {
    id: 'Undo',
    defaultMessage: 'Undo',
  },
  urlmanagement: {
    id: 'URL Management',
    defaultMessage: 'URL Management',
  },
  contentRules: {
    id: 'Content Rules',
    defaultMessage: 'Content Rules',
  },
  relations: {
    id: 'Relations',
    defaultMessage: 'Relations',
  },
});

/**
 * Controlpanels container class.
 */
function Controlpanels(props) {
  let filteredControlPanels = [];
  const intl = useIntl();
  const [isClient, setIsClient] = useState(false);

  const controlpanels = useSelector(
    (state) => state.controlpanels.controlpanels,
  );
  const controlpanelsRequest = useSelector((state) => state.controlpanels.list);
  const pathname = props.location.pathname;
  const systemInformation = useSelector(
    (state) => state.controlpanels.systeminformation,
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const error = controlpanelsRequest?.error;

  if (error) {
    return <Error error={error} />;
  }

  let customcontrolpanels = config.settings.controlpanels
    ? config.settings.controlpanels.map((el) => {
        el.group =
          intl.formatMessage({
            id: el.group,
            defaultMessage: el.group,
          }) || el.group;
        return el;
      })
    : [];
  const { filterControlPanels } = config.settings;

  if (controlpanels?.length) {
    filteredControlPanels = map(
      concat(filterControlPanels(controlpanels), customcontrolpanels, [
        {
          '@id': '/addons',
          group: intl.formatMessage(messages.general),
          title: intl.formatMessage(messages.addons),
        },
        {
          '@id': '/database',
          group: intl.formatMessage(messages.general),
          title: intl.formatMessage(messages.database),
        },
        {
          '@id': '/rules',
          group: intl.formatMessage(messages.content),
          title: intl.formatMessage(messages.contentRules),
        },
        {
          '@id': '/undo',
          group: intl.formatMessage(messages.general),
          title: intl.formatMessage(messages.undo),
        },
        {
          '@id': '/aliases',
          group: intl.formatMessage(messages.general),
          title: intl.formatMessage(messages.urlmanagement),
        },
        {
          '@id': '/relations',
          group: intl.formatMessage(messages.content),
          title: intl.formatMessage(messages.relations),
        },
        {
          '@id': '/moderate-comments',
          group: intl.formatMessage(messages.content),
          title: intl.formatMessage(messages.moderatecomments),
        },
        {
          '@id': '/users',
          group: intl.formatMessage(messages.usersControlPanelCategory),
          title: intl.formatMessage(messages.users),
        },
        {
          '@id': '/usergroupmembership',
          group: intl.formatMessage(messages.usersControlPanelCategory),
          title: intl.formatMessage(messages.usergroupmemberbership),
        },
        {
          '@id': '/groups',
          group: intl.formatMessage(messages.usersControlPanelCategory),
          title: intl.formatMessage(messages.groups),
        },
      ]),
      (controlpanel) => ({
        ...controlpanel,
        id: last(controlpanel['@id'].split('/')),
      }),
    );
  }
  const groups = map(uniqBy(filteredControlPanels, 'group'), 'group');
  const { controlPanelsIcons: icons } = config.settings;

  return (
    <div className="view-wrapper">
      <Helmet title={intl.formatMessage(messages.sitesetup)} />
      <Container className="controlpanel">
        <Segment.Group raised>
          <Segment className="primary">
            <FormattedMessage id="Site Setup" defaultMessage="Site Setup" />
          </Segment>
          {systemInformation && systemInformation.upgrade && (
            <Message attached warning>
              <FormattedMessage
                id="The site configuration is outdated and needs to be upgraded."
                defaultMessage="The site configuration is outdated and needs to be upgraded."
              />{' '}
              <UniversalLink href={`/controlpanel/plone-upgrade`}>
                <FormattedMessage
                  id="Please continue with the upgrade."
                  defaultMessage="Please continue with the upgrade."
                />
              </UniversalLink>
            </Message>
          )}
          {map(groups, (group) => [
            <Segment key={`header-${group}`} secondary>
              {group}
            </Segment>,
            <Segment key={`body-${group}`} attached>
              <Grid doubling columns={6}>
                <Grid.Row>
                  {map(
                    sortBy(
                      filter(filteredControlPanels, { group }),
                      (controlpanel) => controlpanel.title,
                    ),
                    (controlpanel) => (
                      <Grid.Column key={controlpanel.id}>
                        <UniversalLink
                          href={`/controlpanel/${controlpanel.id}`}
                        >
                          <Header as="h3" icon textAlign="center">
                            <Icon
                              name={icons?.[controlpanel.id] || icons.default}
                              size="48px"
                            />
                            <Header.Content>
                              {controlpanel.title}
                            </Header.Content>
                          </Header>
                        </UniversalLink>
                      </Grid.Column>
                    ),
                  )}
                </Grid.Row>
              </Grid>
            </Segment>,
          ])}
        </Segment.Group>
        <Segment.Group raised>
          <Segment className="primary">
            <FormattedMessage
              id="Version Overview"
              defaultMessage="Version Overview"
            />
          </Segment>
          <Segment attached>
            {systemInformation ? (
              <VersionOverview {...systemInformation} />
            ) : null}
          </Segment>
        </Segment.Group>
      </Container>
      {isClient && (
        <Portal node={document.getElementById('toolbar')}>
          <Toolbar
            pathname={pathname}
            hideDefaultViewButtons
            inner={
              <UniversalLink href="/" className="item">
                <Icon
                  name={backSVG}
                  className="contents circled"
                  size="30px"
                  title={intl.formatMessage(messages.back)}
                />
              </UniversalLink>
            }
          />
        </Portal>
      )}
    </div>
  );
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Controlpanels.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default compose(
  asyncConnect([
    {
      key: 'controlpanels',
      promise: async ({ location, store: { dispatch } }) =>
        await dispatch(listControlpanels()),
    },
    {
      key: 'systemInformation',
      promise: async ({ location, store: { dispatch } }) =>
        await dispatch(getSystemInformation()),
    },
  ]),
  withRouter,
)(Controlpanels);
