import * as shell from "shelljs";

shell.cp("-R", "index.html", "dist/");
shell.cp("-R", "src/public/", "dist/");
