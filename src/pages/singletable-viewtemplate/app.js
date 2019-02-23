/**
 * 整个应用的入口，包含路由，数据管理加载
 */

import React from "react";
import 'core-js/es6/map';
import 'core-js/es6/set';
import logger from "redux-logger";
import mirror, { render,Router } from "mirrorx";
import Intl from 'components/Intl';
import Routes from './routes'
import 'tinper-bee/assets/tinper-bee.css'
import "src/app.less";
import "bee-complex-grid/build/Grid.css";


const MiddlewareConfig = [];

if(__MODE__ == "development") MiddlewareConfig.push(logger);

mirror.defaults({
    historyMode: "hash",
    middlewares: MiddlewareConfig
});



render(<Intl><Router>
    <Routes />
</Router></Intl>, document.querySelector("#app"));
