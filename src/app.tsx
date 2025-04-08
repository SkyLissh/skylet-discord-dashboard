import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./app.css";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import Layout from "./layout";

export default function App() {
  return (
    <Router root={(props) => <Layout {...props} />}>
      <FileRoutes />
    </Router>
  );
}
