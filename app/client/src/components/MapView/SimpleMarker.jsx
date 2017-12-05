import React, { Component } from 'react';
import { Label, Popup, Header, Icon, Image, Button, Accordion } from 'semantic-ui-react';
import shortid from 'shortid';
// import 'react-tippy/'
import logo from './sentiments/5.svg';
import './styles.css';


class SimpleMarker extends Component {
  state = { activeIndex: 0 };
  changeIndex = ((e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  })
  fetchRelated = () => {
    const {
      article: {
        title,
        keywords,
        people,
        organizations,
        categories,
      },
      fetchRelatedArticles,
    } = this.props;

    fetchRelatedArticles(title, keywords.join(), people.join(), organizations.join(), categories.join());
  }

  render() {
    const {
      article: {
        topImageUrl,
        url,
        sourceUrl,
        source,
        title,
        authors,
        publishDate,
        summary,
        categories,
        keywords,
        sentiment,
      },
    } = this.props;

    const sentiments = [
      './sentiments/5.svg',
      './sentiments/4.svg',
      './sentiments/3.svg',
      './sentiments/2.svg',
      './sentiments/1.svg',
      './sentiments/0.svg',
      './sentiments/-1.svg',
    ];

    const { activeIndex } = this.state;

    const length = 400;
    const shortSummary = `${summary[0].substring(0, length)}...`;
    const multiAuthor = authors.map((author) => (
      <span key={shortid.generate()}>
        {author},
      </span>
    ));

    const sentimentValue = Math.round(sentiment.subjectivity * 100);
    let theSentiment;

    if (sentimentValue < 45) {
      theSentiment = <Label tag>Bad {sentimentValue}%</Label>;
    } else if (sentimentValue > 45 && sentimentValue <= 55) {
      theSentiment = <Label tag>Neutral {sentimentValue}%</Label>;
    } else if (sentimentValue > 55 && sentimentValue <= 100) {
      theSentiment = <Label tag>Good {sentimentValue}%</Label>;
    }

    return (
      <div className="simple-marker-container">
        <Popup
          position="bottom left"
          className="popup-container"
          trigger={
            <Icon
              color="red"
              name="marker"
              // size={$hover ? 'huge' : 'big'}
              // className={`marker ${$hover ? 'hovered' : ''}`}
              size="huge"
              className="marker hovereds"
            />
        }
          onOpen={() => {
            // this.fetchRelated();
          }}
          hoverable
        >
          <div className="image-container">
            <Image
              src={topImageUrl}
              shape="rounded"
              className="simple-marker-image"
            />
            <Button color="blue" content="Read More" className="read-more-button" circular href={url} target="_blank" />
          </div>

          <Header as="a" href={url} target="_blank" color="blue">{title}</Header>

          <div className="author-date-container">
            <div className="author-name">
              {multiAuthor} | {new Date(publishDate).toDateString()}
            </div>
          </div>

          <Accordion basic className="accordion-container">
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.changeIndex}>
              <Icon name="dropdown" />
            Summary
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              {shortSummary}
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.changeIndex}>
              <Icon name="dropdown" />
            Tags
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <Label.Group size="tiny" className="label-group">
                <div className="label-master">
                  <Label basic color="pink">Category</Label>
                </div>
                <div>
                  {categories.map((category) => (<Label tag key={shortid.generate()}>{category.label}</Label>))}
                </div>
              </Label.Group>
              <Label.Group size="tiny" className="label-group">
                <div className="label-master">
                  <Label basic color="teal">Keywords</Label>
                </div>
                <div>
                  {keywords.slice(0, 5).map((keyword) => (<Label as="a" tag style={{ marginBottom: '0.3rem' }} key={shortid.generate()}>{keyword}</Label>))}
                </div>
              </Label.Group>
              <Label.Group size="tiny" className="label-group">
                <div className="label-master">
                  <Label basic color="orange">Sentiment</Label>
                </div>
                <div>
                  {theSentiment}
                </div>
              </Label.Group>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 2} index={2} onClick={this.changeIndex}>
              <Icon name="dropdown" />
            Related Stories
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
              <Header as="a" href={url} target="_blank" color="blue" className="tooltip-related-article">{title}</Header>
              <br />
              <span className="tooltip-author">{new Date(publishDate).toDateString()} | {multiAuthor}</span>
            </Accordion.Content>
          </Accordion>
          <section className="sentiments">
            <Image src={logo} alt="" />
          </section>
        </Popup>
      </div>
    );
  }
}

export default SimpleMarker;
