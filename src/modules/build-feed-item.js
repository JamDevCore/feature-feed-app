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
  const currentValue = (attributes.value && attributes.value.value) || 0;
  const reactionType = attributes['data-reaction-type'].value;
  document.querySelector(`#${elementId}`).setAttribute('class', 'reaction-button selected');
  document.querySelector(`#good-reactions-${recordId}`).setAttribute('disabled', true);
  document.querySelector(`#bad-reactions-${recordId}`).setAttribute('disabled', true);


  var Airtable = require('airtable');
  var base = new Airtable({ apiKey }).base(airBase);
  const newTotal = parseInt(currentValue) + 1;

  console.log(newTotal)
  console.log(attributes['data-record-id'].value)

  base(table).update(recordId, {
    [reactionType]: newTotal,
  }, function(err, record) {
    if (err) { console.error(err); return; }
    document.querySelector(`#${elementId}`).value = record.fields[reactionType];

    console.log(document.querySelector(`#${elementId}`).value)
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
      const thumbsup = build('button', [
        { name: 'class', value: 'reaction-button'},
        { name: 'id', value: `good-reactions-${record._id}`},
        { name: 'data-reaction-type', value: 'good-reactions'},
        { name: 'value', value: record['good-reactions']},
        { name: 'data-record-id', value: record._id},
      ],'&#x1f44d;');
      const thumbsdown = build('button', [
        { name: 'class', value: 'reaction-button'},
        { name: 'id', value: `bad-reactions-${record._id}`},
        { name: 'data-reaction-type', value: 'bad-reactions'},
        { name: 'value', value: record['bad-reactions']},
        { name: 'data-record-id', value: record._id},
      ],'&#x1f44e;');

      const rateContainer = build('div', [{ name: 'class', value: 'rate-container'}]);
      const rateText = build('p', [], 'Rate this!');
      const rateButtons = build('div', []);

      rateContainer.appendChild(rateText);
      rateContainer.appendChild(rateButtons);

      rateButtons.appendChild(thumbsup)
      rateButtons.appendChild(thumbsdown)

      footer.appendChild(rateContainer);
      thumbsup.addEventListener('click', (e) => sendReaction(e, apiKey, table, base))
      thumbsdown.addEventListener('click', (e) => sendReaction(e, apiKey, table, base))
    }
    item.appendChild(footer);
    feed.appendChild(item);
  } catch (exception) {
    console.log(exception);
  }
}

export default addFeedItem;
