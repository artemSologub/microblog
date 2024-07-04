function sortByCreationDate(inputArr) {
  return inputArr
    .map((item) => {
      const date = new Date(`${item.date_creation}`);
      item.date_creation = date.toUTCString();

      if (item?.comments?.length) {
        item.comments = sortByCreationDate(item.comments);
      }
      return item;
    })
    .sort(function (a, b) {
      return new Date(b.date_creation) - new Date(a.date_creation);
    });
}

module.exports = { sortByCreationDate };
