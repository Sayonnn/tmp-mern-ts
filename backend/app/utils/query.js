export const startQuery = async (model, action, query = {}, update = {}) => {
  if (!model || !action) {
    throw new Error("Model and action are required");
  }

  try {
    switch (action) {
      case "find":
        return await model.find(query);
      case "findOne":
        return await model.findOne(query);
      case "create":
        return await model.create(query);
      case "updateOne":
        return await model.updateOne(query, update);
      case "deleteOne":
        return await model.deleteOne(query);
      default:
        throw new Error("Unsupported action");
    }
  } catch (err) {
    throw err;
  }
};
