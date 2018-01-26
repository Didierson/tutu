import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchArticles,
  fetchFocusedInfo,
  updateMapState,
  fetchFocusedClusterInfo,
  toggleSourcesType,
  clearState,
} from '../../modules/mapArticles';
import { openModal } from '../../modules/insights';
import { fetchRecentArticles } from '../../modules/recentArticles';
import { fetchPopularArticles } from '../../modules/popularArticles';
import MapInterface from '../Common/MapInterface';
import Map from './Map';
import './styles.css';
import '../../index.css';

const mapStateToProps = ({
  mapArticles: {
    articles,
    clusters,
    mapState,
    isCredible,
    focusedOn,
    fetchStatus,
    initLoad,
  },
}) => ({
  // mapState: map.viewport.toJS(),
  mapState,
  articles,
  clusters,
  isCredible,
  focusedOn,
  fetchStatus,
  initLoad,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchArticles,
  fetchFocusedInfo,
  updateMapState,
  fetchFocusedClusterInfo,
  toggleSourcesType,
  fetchRecentArticles,
  fetchPopularArticles,
  openModal,
  clearState,
}, dispatch);

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
class MapView extends Component {
  _onChange = ({ center, zoom, marginBounds }) => {
    const { initLoad } = this.props;
    this.props.updateMapState(center, zoom, marginBounds);

    if (initLoad) {
      this.props.fetchArticles();
    }
  }

  _onChildClick = (_, childProps) => {
    if (childProps.articles) {
      this.props.fetchFocusedClusterInfo(childProps.articles);
    } else {
      this.props.fetchFocusedInfo(childProps.article);
    }
  }

  render() {
    const {
      articles,
      clusters,
      mapState,
      isCredible,
      focusedOn,
      history: { location, push },
      fetchStatus,
    } = this.props;
    const isMap = !/grid/.test(location.pathname);

    return (
      <div className="map-container">
        <MapInterface
          isMap={isMap}
          isCredible={isCredible}
          status={fetchStatus}
          isMobile={isMobile}
          updateMapState={this.props.updateMapState}
          fetchArticles={this.props.fetchArticles}
          openInsights={this.props.openModal}
          onSourcesTypeToggle={(isSidebarVisible) => {
            this.props.toggleSourcesType();
            this.props.fetchArticles();

            if (isSidebarVisible) {
              this.props.fetchRecentArticles();
              this.props.fetchPopularArticles();
            }
          }}
          onViewToggle={() => {
            this.props.clearState();
            push('/grid/');
          }}
        />
        <Map
          mapState={mapState}
          clusters={clusters}
          articles={articles}
          openInsights={this.props.openModal}
          updateMapState={this.props.updateMapState}
          onChange={this._onChange}
          onChildClick={this._onChildClick}
          isCredible={isCredible}
          isFocused={focusedOn}
          isMobile={isMobile}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView);

