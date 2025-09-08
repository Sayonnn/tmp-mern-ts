import path from "path";
import hbs from "handlebars";
import { config } from "../configs/index.js";

hbs.registerHelper("app", () => {
  return config.app;
});

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve("./templates/emails"),
    layoutsDir: path.resolve("./templates/emails"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./templates/emails"),
  extName: ".hbs",
};

export default handlebarOptions;
