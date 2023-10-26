const { Validator } = require("node-input-validator");

const BlogPOST = {
  title: "required|string",
  content: "required|string",
};

const BlogPUT = {
  title: "string",
  content: "string",
};

const validate = async (data, schema) => {
  let v = new Validator(data, schema);
  let e = v.check();
  if (!e) {
    throw {
      code: 400,
      error: v.errors,
    };
  }
};

module.exports = {
  BlogPOST,
  BlogPUT,
  validate,
};
