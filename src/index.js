import getParams from './modules/get-params';
import feedContainer from './feed-container';
import buildFeedItem from './modules/build-feed-item';
import loading from './loading';
import './index.css';


(function initFeed() {
  window.onload = function() {
    try {
      const url = window.location.href;
      const details = getParams(url);
      const { apiKey, base, table } = details;
      if (!apiKey || !base || !table) {
        throw new Error('Please add config data to the script tag');
        // Right in fallback e.g Get Feature Feed here!
      } else {
      document.body.innerHTML = feedContainer;
      const feed = document.querySelector('.feed');
      feed.innerHTML = loading;
      const Airtable = require('airtable');
      const currentBase = new Airtable({ apiKey }).base(base);
      currentBase(table).select({
          // Selecting the first 3 records in Grid view:
          maxRecords: 5,
          view: "Grid view"
      }).eachPage(function page(records, fetchNextPage) {
          feed.innerHTML = '';
          // document.querySelector('.feed-closeButton').addEventListener('click', () => closeFeed())
          records.forEach(function(record) {
              console.log('Retrieved', record.get('title'));
              buildFeedItem(record.fields, feed, apiKey, base, table);
          });
      }, function done(err) {
          if (err) { console.error(err); return; }
      });
    }
  } catch (exception) {
    console.log(exception);
  }
}
}());
