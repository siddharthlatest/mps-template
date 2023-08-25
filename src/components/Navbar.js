import React from 'react';
import { withRouter } from 'react-router-dom';
import { css } from '@emotion/css';
import { ReactiveComponentPrivate as ReactiveComponent } from '@appbaseio/reactivesearch';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core';
import getPreferences from '../utils/preferences';

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
const searchStyles = css`
	width: 50%;
	color: black;
	@media (max-width: 576px) {
		width: 70%;
	}
	input {
		border: 1px solid #e8e8e8;
		background: white;
		border-radius: 2px;
	}
	input:hover {
		border-color: #d9d9d9;
	}
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

const preferences = getPreferences();
const globalSettings = preferences.globalSettings ? preferences.globalSettings : {};
const logoSettings = globalSettings.meta.branding;

const Navbar = ({ dataSearchProps, history, classes, page, searchComponent }) => {
	return (
		<AppBar position={searchComponent.showSearchAs || 'sticky'} className={classes.appBar}>
			<a href="/" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<span className={logoStyles}>
					{logoSettings.logoUrl ? (
						<img src={logoSettings.logoUrl} width={logoSettings.logoWidth} alt="Logo" />
					) : (
						preferences.name || ''
					)}
				</span>
			</a>

			<ReactiveComponent
				componentId="search"
				preferencesPath={`pageSettings.pages.${page}.componentSettings.search`}
				className={searchStyles}
				onValueSelected={(value) => {
					if (value) {
						history.push(`/search/?search="${value}"`);
					}
				}}
				{...dataSearchProps}
			/>
		</AppBar>
	);
};

export default withRouter(withStyles(styles)(Navbar));
