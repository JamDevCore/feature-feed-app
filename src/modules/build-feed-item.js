import build from './build';

const tag = {
  news: {
    color: 'background-color:#F5CA61', label: 'News',
  },
  feature: {
    color: 'background-color:#CD557B', label: 'Feature',
  },
}

const sendReaction = (recordId, recordValue,apiKey, table, airBase) => {
  const newValue = (parseInt(recordValue) || 0) + 1;
  var Airtable = require('airtable');
  var base = new Airtable({ apiKey }).base(airBase);

  base(table).update(recordId, {
    'hearts': newValue,
  }, function(err, record) {
    if (err) { console.error(err); return; }
  });
}

const addFeedItem = (record, feed, apiKey, base, table) => {
  try {
    console.log(record)
    const item = build('div', [{ name:'class', value: 'item'}, { name: 'id', value: record.title }]);
    const itemHeader = build('div', [{ name: 'class', value: 'item-header'}]);
    const footer = build('div', [{ name: 'class', value: 'item-footer'}]);
    item.appendChild(itemHeader)

    if(record.date) {
      const date = build('p', [{ name: 'class', value: 'item-date'}], record.date);
      itemHeader.appendChild(date);
      item.appendChild(itemHeader);
    }

    if(record.tag) {
      const badge = build('span', [
        { name: 'class', value: 'item-badge'},
        { name: 'style', value: tag[record.tag].color },
      ], tag[record.tag].label);
      itemHeader.appendChild(badge);
    }

    if(record.title) {
      const title = build('h3', [], record.title);
      item.appendChild(title);
    }

    if(record.notes) {
      const text = build('p', [], record.notes);
      item.appendChild(text);
    }
    if(record.link) {
      const link = build('a', [
        { name: 'href', value: record.link },
        { name: "target", value: '_blank' },
        { name: "rel", value: "noopener noreferrer"},
      ], 'Read more');
      footer.appendChild(link);
    }
    if(record.reactions) {
      const heart = build('div', [
        { name: 'class', value: 'reaction-button lottie'},
        { name: 'id', value: `heart-${record._id}`},
        { name: 'data-record-id', value: record._id},
        { name: 'data-record-value', value: record.hearts },
      ]);
      const rateContainer = build('div', [{ name: 'class', value: 'rate-container'}]);
      const rateButtons = build('div', []);

      rateContainer.appendChild(heart);
      const data = 'https://assets1.lottiefiles.com/datafiles/d9bc9kYC2VttaKb/data.json';
      let isActive = false

      const animation = bodymovin.loadAnimation({
        container: heart,
        path: data,
        renderer: 'svg',
        loop: false,
        autoplay: false
      });

      heart.addEventListener('click', function(e) {
        e.preventDefault();
        if (isActive) {
          heart.classList.remove('is-active');
          animation.stop();
        } else {

          heart.classList.add('is-active');
          setTimeout(() => {
            animation.play();
          }, 20);
        }
        isActive = !isActive
      });

      animation.addEventListener('complete', e => {
        animation.stop();
      })
      footer.appendChild(rateContainer);
      heart.addEventListener('click', (e) => sendReaction(record._id, record.hearts, apiKey, table, base))
    }
    item.appendChild(footer);
    feed.appendChild(item);
  } catch (exception) {
    console.log(exception);
  }
}

export default addFeedItem;
