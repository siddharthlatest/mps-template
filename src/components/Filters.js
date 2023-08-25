import React from 'react';
import { ReactiveComponentPrivate as ReactiveComponent } from '@appbaseio/reactivesearch';
import { css } from '@emotion/css';

/*
	This component define all the filters placed in Drawer in Search Page.
	Note: We are using ReactiveComponent to Generate custom List and Dropdown Component.
*/

const container = css`
	margin: 50px 10px;
`;

const Filters = ({ components }) => {
	return (
		<div className={container}>
			{components.map((component) => (
				<ReactiveComponent
					preferencesPath={`pageSettings.pages.search.componentSettings.${component.key}`}
					componentId={component.rsConfig.componentId}
					key={component.key}
					style={{ marginBottom: 10 }}
					renderNoResults={() => 'No results Found!'}
					innerClass={{
						input: 'list-input',
						list: 'multi-list-li',
						'input-container': 'range-input-render-input',
					}}
				/>
			))}
		</div>
	);
};

export default Filters;
