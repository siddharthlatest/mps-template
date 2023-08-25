import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { injectGlobal } from '@emotion/css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { Helmet } from 'react-helmet';

import Home from './pages/Home';
import Search from './pages/Search';
import getPreferences from './utils/preferences';
import Detail from './pages/Detail';

/*
	This is where we define the Routing.
	ReactiveBase is a container component that wraps all the ReactiveSearch components together

	For URL / we render Home Component i.e. Home Page.
	For URL /search we render Search Component i.e. Search Page.
	For URL /book/:id we render Book Component i.e. Book Detail Page - We will get :id in props.match.params.

	Last Route i.e. L40 can be use to define Not Found Page for now we are just displaying Home page.
*/

const preferences = getPreferences();
const { themeSettings } = preferences;
const fontFamily = themeSettings.rsConfig.typography.fontFamily || '';
const googleFontWeight = themeSettings.meta.fontWeight
	? `:wght@${themeSettings.meta.fontWeight}`
	: '';
const googleFont = fontFamily + googleFontWeight;
const safeFontFamily = fontFamily ? `${fontFamily}, sans-serif` : 'sans-serif';

const themeValue = createMuiTheme({
	// brand colors
	palette: {
		primary: {
			main: themeSettings.rsConfig.colors.primaryColor,
		},
	},
	typography: {
		fontFamily: safeFontFamily,
		fontWeight: themeSettings.meta.fontWeight,
	},
});

// eslint-disable-next-line
injectGlobal`
* {
    margin: 0;
  }
  a{
	  text-decoration: none;
  }
  ${themeSettings.customCss}
	body {
		font-weight: ${themeSettings.meta.fontWeight};
		font-family: ${safeFontFamily};
		color: ${themeSettings.rsConfig.colors.textColor};
		background-color: ${themeSettings.meta.bodyBackgroundColor};
	}
	h1,
	h2,
	h3 {
		color: ${themeSettings.rsConfig.titleColor};
	}
`;

const App = () => (
	<MuiThemeProvider theme={themeValue}>
		<Helmet>
			<link
				href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/leaflet.css"
				rel="stylesheet"
			/>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
			<link
				href={`https://fonts.googleapis.com/css2?family=${googleFont}&display=swap`}
				rel="stylesheet"
			/>
		</Helmet>
		<Router>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/search" component={Search} />
				<Route exact path="/detail/:id" component={Detail} />
				<Route component={Home} />
			</Switch>
		</Router>
	</MuiThemeProvider>
);

export default App;
