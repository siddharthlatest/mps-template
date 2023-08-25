import React from 'react';
import {
	AIAnswer,
	ReactiveBase,
	ReactiveComponentPrivate as ReactiveComponent,
	SelectedFilters,
} from '@appbaseio/reactivesearch';
import { withStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import List from '../components/List';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import { getPagePreferences } from './utils';
import getPreferences from '../utils/preferences';

const drawerWidth = 300;

const styles = (theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		marginTop: '60px',
	},
	drawerPaper: {
		width: drawerWidth,
		height: '100vh',
	},
	drawerButton: {
		position: 'sticky',
		bottom: 0,
		borderRadius: 0,
		background: '#174ff4',
	},
	content: {
		flexGrow: 1,
		marginTop: 100,
		padding: '0 40px',
	},
	toolbar: theme.mixins.toolbar,
});

/*
	** Drawer **
	This page is mobile responsive and we show a Drawer in
	Screen less than 576px, or else we show a sidebar.
	Sider and Drawer are use to display the necessary Filters.
	** Content **
	Whereas main is used to display the Results using List &
	SelectedFilters using CustomSelectedFilters.
*/

const preferences = getPreferences();
const {
	otherComponents,
	fusionSettings,
	endpoint,
	searchComponent,
	mongoDBSettings,
	resultComponent,
} = getPagePreferences('search');
const appbaseSettings = preferences ? preferences.appbaseSettings : {};
const themeSettings = Object.assign(
	{ rsConfig: { typography: {}, colors: {} }, meta: {} },
	preferences.themeSettings,
);

const isTransformRequest = preferences.backend === 'fusion' || preferences.backend === 'mongodb';

const nonTabDataListComponents = otherComponents.filter(
	(component) => component.rsConfig.componentType !== 'TABDATALIST',
);
const tabDataLists = otherComponents.filter(
	(component) => component.rsConfig.componentType === 'TABDATALIST',
);
const tabDataList = tabDataLists[0];

class Search extends React.Component {
	state = {
		isDrawer: false,
	};

	handleDrawer = () => {
		this.setState((prevState) => ({
			isDrawer: !prevState.isDrawer,
		}));
	};

	render() {
		const { isDrawer } = this.state;
		const { classes } = this.props;
		const isSmallScreen = window.innerWidth < 576;
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
											fusionSettings.meta &&
											fusionSettings.meta.sponsoredProfile,
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
				<Navbar
					hideShowButton={false}
					searchId="search"
					page="search"
					searchComponent={searchComponent}
				/>
				<Drawer
					className={classes.drawer}
					variant={isSmallScreen ? 'temporary' : 'permanent'}
					open={isSmallScreen ? isDrawer : true}
					classes={{
						paper: classes.drawerPaper,
					}}
					onClose={isSmallScreen ? this.handleDrawer : undefined}
				>
					<div className={classes.toolbar} />
					<Filters components={nonTabDataListComponents} />
				</Drawer>

				<main
					className={classes.content}
					style={{ marginLeft: isSmallScreen ? 0 : drawerWidth }}
				>
					{tabDataList ? (
						<div style={{ borderBottom: '1px solid lightgray' }}>
							<ReactiveComponent
								componentId={`${tabDataList.rsConfig.componentId}`}
								preferencesPath={`pageSettings.pages.search.componentSettings.${tabDataList.key}`}
								URLParams
								title=""
							/>
						</div>
					) : null}
					<SelectedFilters />
					{resultComponent.showAIAnswer ? (
						<AIAnswer
							componentId="AI_ANSWER"
							showIcon
							react={{ and: 'search' }}
							enterButton
						/>
					) : null}
					<List
						gridProps={{ md: 4, sm: 6, xs: 12 }}
						cardProps={{
							style: {
								marginBottom: '24px',
							},
						}}
						page="search"
					/>
					{isSmallScreen && (
						<Button
							fullWidth
							className={classes.drawerButton}
							color="primary"
							variant="contained"
							onClick={this.handleDrawer}
						>
							<Icon>filter</Icon>
							Show Filters
						</Button>
					)}
				</main>
			</ReactiveBase>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Search);
