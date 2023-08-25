import React from 'react';
import {
	ReactiveBase,
	ReactiveComponentPrivate as ReactiveComponent,
} from '@appbaseio/reactivesearch';
import { css } from '@emotion/css';
import { useHistory } from 'react-router-dom';
import 'marketplace-footer/build/static/css/index.css';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core';
import List from '../components/List';
import getPreferences from '../utils/preferences';
import { getPagePreferences } from './utils';

const preferences = getPreferences();
const { fusionSettings, endpoint, searchComponent, mongoDBSettings } = getPagePreferences('home');
const globalSettings = preferences.globalSettings ? preferences.globalSettings : {};
const logoSettings = globalSettings.meta.branding;
const appbaseSettings = preferences ? preferences.appbaseSettings : {};
const themeSettings = preferences.themeSettings || {};
const isTransformRequest = preferences.backend === 'fusion' || preferences.backend === 'mongodb';

const headerStyles = css`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background: ${themeSettings.rsConfig.colors.primaryColor};
	padding: 2rem 1rem;
	h1 {
		font-size: 3rem;
		margin: 1rem auto;
		font-weight: 500;
		color: #f7f7f7;
	}
	h2 {
		font-weight: 500;
		color: #eee;
		font-size: 1.6rem;
		margin: 0 0 1rem;
	}
	@media (max-width: 425px) {
		h1 {
			font-size: 1.9rem;
		}
		h2 {
			font-size: 1.2rem;
		}
	}
`;

const inputContainerStyles = css`
	margin: 2em 0.5em;
	width: 50%;
	min-width: 200px;

	@media (max-width: 768px) {
		width: 80%;
	}

	input {
		padding: 15px 20px 15px 40px;
		font-size: 1rem;
		height: auto;
		border: 0;
		box-shadow: 0 10px 5px -5px rgba(0, 0, 0, 0.2);
		border-radius: 5px;
		transition: all ease 0.2s;
	}

	input:hover {
		box-shadow: 0 10px 5px -6px rgba(0, 0, 0, 0.1);
	}
	b {
		background-color: yellow;
	}
`;

const resultStyles = css`
	padding: 20px 40px;
	overflow: hidden;
	@media (max-width: 576px) {
		padding: 20px;
	}
`;

const logoStyles = css`
	box-shadow: 2px 2px #1890ff, 4px 4px #096dd9;
	padding: 10px;
	color: #eaeaea;
	font-weight: 600;
	background: white;
	color: #1890ff;
	border-radius: 2px;
	border: 1px solid #bae7ff;
`;

const styles = (theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		flexDirection: 'row',
		height: '64px',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '10px',
		boxShadow: 'none',
	},
});

/*

	Header component is use to define Navbar, we can add more items inside it.

	** DataSearch **
	DataSearch is used to display the input box which renders Suggestions on typing.
	If you press enter you will be redirected to Search Page with the entered Query.
	This is done using onValueSelected Prop.
	We are rendering custom Suggestions in DataSearch, check Suggestions Component
	present in ../components Directory.

	** List **
	List component is custom component which uses ReactiveList. You can use
	reactiveListProps to pass props directly to the ReactiveList.

	When on Large Screen it will display Cards Layout & on small screen it displays
	List layout.

*/

const Home = ({ classes }) => {
	const history = useHistory();
	return (
		<ReactiveBase
			endpoint={endpoint}
			app={appbaseSettings.index}
			credentials={appbaseSettings.credentials}
			url={appbaseSettings.url}
			theme={themeSettings.rsConfig}
			preferences={preferences}
			transformRequest={
				isTransformRequest
					? (props) => {
							const newBody = JSON.parse(props.body);
							newBody.metadata = {
								...(preferences.backend === 'fusion' && {
									app: fusionSettings.app,
									profile: fusionSettings.profile,
									suggestion_profile: fusionSettings.searchProfile,
									sponsored_profile:
										fusionSettings.meta && fusionSettings.meta.sponsoredProfile,
								}),
								...(preferences.backend === 'mongodb' && {
									db: mongoDBSettings.db,
									collection: mongoDBSettings.collection,
								}),
							};

							// eslint-disable-next-line
							props.body = JSON.stringify(newBody);
							return props;
					  }
					: undefined
			}
		>
			<React.Fragment>
				<AppBar
					position={searchComponent.showSearchAs || 'sticky'}
					className={classes.appBar}
				>
					<span className={logoStyles}>
						{logoSettings.logoUrl ? (
							<img
								src={logoSettings.logoUrl}
								width={logoSettings.logoWidth}
								alt="Logo"
							/>
						) : (
							'RS'
						)}
					</span>
					{searchComponent.showSearchAs === 'sticky' ? (
						<div style={{ width: '20%', color: 'black' }}>
							<ReactiveComponent
								componentId="search"
								preferencesPath="pageSettings.pages.home.componentSettings.search"
								onValueSelected={(value) => {
									history.push(`/search/?search="${value}"`);
								}}
							/>
						</div>
					) : null}
				</AppBar>
				<div className={headerStyles}>
					<h1>The BookSearch App</h1>
					<h2>Search Books & more.</h2>
					{searchComponent.showSearchAs !== 'sticky' ? (
						<ReactiveComponent
							componentId="search"
							preferencesPath="pageSettings.pages.home.componentSettings.search"
							className={inputContainerStyles}
							onValueSelected={(value) => {
								history.push(`/search/?search="${value}"`);
							}}
						/>
					) : null}
				</div>
				<div className={resultStyles}>
					<List
						title="Trending Now"
						page="home"
						responsiveCards={{ md: 12, sm: 12, xs: 24 }}
					/>
				</div>
			</React.Fragment>
		</ReactiveBase>
	);
};

export default withStyles(styles, { withTheme: true })(Home);
