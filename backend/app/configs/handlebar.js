import path from "path";

/** Configure Handlebars */
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
