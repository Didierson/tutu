import React, { PureComponent } from 'react';
import { Icon, Input, Button, Menu, Image, Message } from 'semantic-ui-react';
import { NProgress } from 'redux-nprogress';
import AppSidebar from '../AppSidebar';
import Insights from '../Insights';
import tutuLogo from '../../assets/logo/tutu-logo.png';
import SimpleModal from './SimpleModal';
import ClusterModal from './ClusterModal';

class MapInterface extends PureComponent {
  state = {
    currentPosition: null,
    isSidebarWiden: false,
    isSidebarVisible: false,
    isMsgShown: true,
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.setState({
        currentPosition: {
          lat: coords.latitude,
          lng: coords.longitude,
        },
      });
    });
  }

  onSourcesTypeToggle_ = () => {
    const { isSidebarVisible } = this.state;

    this.setState({ isMsgShown: true });
    this.props.onSourcesTypeToggle(isSidebarVisible);
  }

  getBtnsClassName = () => {
    const {
      isSidebarVisible,
      isSidebarWiden,
    } = this.state;

    if (isSidebarVisible && isSidebarWiden) {
      return 'adjust-top-buttons-widen-visible';
    }

    if (isSidebarVisible) {
      return 'adjust-top-buttons-visible';
    }

    if (isSidebarWiden) {
      return 'adjust-top-buttons-widen';
    }

    return '';
  }

  expandSidebar = () => this.setState({ isSidebarWiden: true })
  shrinkSidebar = () => this.setState({ isSidebarWiden: false })
  showSidebarContent = () => this.setState({ isSidebarVisible: true })
  toggleSidebarContent = () => this.setState({ isSidebarVisible: !this.state.isSidebarVisible })
  closeMessage = () => this.setState({ isMsgShown: false })

  render() {
    const {
      status,
      isCredible,
      isMap,
      onViewToggle,
      fetchArticles,
      focusedOn,
      openInsights,
    } = this.props;
    const {
      currentPosition,
      isSidebarVisible,
      isSidebarWiden,
      isMsgShown,
    } = this.state;

    return (
      <div>
        <NProgress />
        {focusedOn === 'simple' ? <SimpleModal /> : null}
        {focusedOn === 'cluster' ? <ClusterModal /> : null}
        {isMsgShown ? (
          <Message
            header={`Map of ${isCredible ? 'Credible' : 'Not Credible'} Sources`}
            content={`Each marker contains news from ${isCredible ? 'credible' : 'not credible'} sources`}
            className="src-type-message"
            onDismiss={this.closeMessage}
          />
        ) : null}
        <AppSidebar
          isWide={isSidebarWiden}
          isVisible={isSidebarVisible}
          showSidebarContent={this.showSidebarContent}
          toggleSidebarContent={this.toggleSidebarContent}
          expandSidebar={this.expandSidebar}
          shrinkSidebar={this.shrinkSidebar}
          fetchArticles={fetchArticles}
        />
        <div className="show-on-mobile">
          <Menu fixed="top" borderless>
            <Menu.Item>
              <Image src={tutuLogo} className="mobile-tutu-logo" />
            </Menu.Item>
            <Menu.Item header className="mobile-tutu-title">TUTÛ</Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Input icon className="search-topbar-mobile">
                  <input id="searchBoxInput" placeholder="Search places" />
                  <Icon name="search" />
                </Input>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Button
            size="large"
            color="red"
            icon="newspaper"
            className="fake-news-button-mobile"
            onClick={this.onSourcesTypeToggle_}
            circular
          />
          <Button
            size="large"
            color="blue"
            icon="bar chart"
            className="insights-button-mobile"
            onClick={openInsights}
            circular
          />
        </div>
        <div className="hide-when-mobile">
          <div className={`map-top-buttons ${this.getBtnsClassName()}`}>
            {status.success ? <Insights /> : null}
            <Button
              content={`${isCredible ? 'Not Credible' : 'Credible'} Sources`}
              color={`${isCredible ? 'red' : 'green'}`}
              icon="newspaper"
              labelPosition="left"
              onClick={this.onSourcesTypeToggle_}
            />
          </div>
          <div className={`map-bot-buttons ${this.getBtnsClassName()}`}>
            <Button
              labelPosition="left"
              content={isMap ? 'Grid View' : 'Map View'}
              icon={isMap ? 'grid layout' : 'map'}
              onClick={onViewToggle}
            />
          </div>
          <Input className="search-box" icon>
            <input id="searchBoxInput" placeholder="Search places" />
            <Icon name="search" />
          </Input>
          {currentPosition ? (
            <Button
              className="current-loc"
              icon="crosshairs"
              onClick={() => {
                this.props.updateMapState(currentPosition, 12);
              }}
              circular
            />
            ) : null}
        </div>
      </div>
    );
  }
}

export default MapInterface;