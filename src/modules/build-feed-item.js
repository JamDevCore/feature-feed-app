import build from './build';

const tag = {
  news: {
    color: 'background-color:#F5CA61', label: 'News',
  },
  feature: {
    color: 'background-color:#CD557B', label: 'Feature',
  },
}

const sendReaction = (event, apiKey, table, airBase) => {

  const { attributes } = event.srcElement;
  const recordId = attributes['data-record-id'].value;
  const elementId = attributes.id.value;
  const heart = document.querySelector(`#${elementId}`)
  heart.setAttribute('class', 'reaction-button selected');
  heart.setAttribute('disabled', true);
  heart.innerHTML = '&#9829;';
  const newValue = (parseInt(heart['data-record-value']) || 0) + 1;
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
    // if(record.reactions) {
    //   const heart = build('button', [
    //     { name: 'class', value: 'reaction-button'},
    //     { name: 'id', value: `heart-${record._id}`},
    //     { name: 'data-record-id', value: record._id},
    //     { name: 'data-record-value', value: record.reactions },
    //   ],'&#9825;');
    //
    //   const rateContainer = build('div', [{ name: 'class', value: 'rate-container'}]);
    //   const rateButtons = build('div', []);
    //
    //   rateContainer.appendChild(heart);
    //
    //   footer.appendChild(rateContainer);
    //   heart.addEventListener('click', (e) => sendReaction(e, apiKey, table, base))
    // }
    item.appendChild(footer);
    feed.appendChild(item);
  } catch (exception) {
    console.log(exception);
  }
}

export default addFeedItem;
