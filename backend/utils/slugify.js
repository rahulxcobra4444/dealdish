const slugify = require('slugify');

const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true
  });
};

const generateUniqueSlug = async (text, Model, id = null) => {
  let slug = generateSlug(text);
  let exists = await Model.findOne({ slug, _id: { $ne: id } });
  let counter = 1;

  while (exists) {
    slug = `${generateSlug(text)}-${counter}`;
    exists = await Model.findOne({ slug, _id: { $ne: id } });
    counter++;
  }

  return slug;
};

module.exports = { generateSlug, generateUniqueSlug };