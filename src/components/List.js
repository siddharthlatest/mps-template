import React from 'react';
import { css } from '@emotion/css';
import { ResultsLayoutByCategory } from '@appbaseio/enterprise-search-ui';

import getPreferences from '../utils/preferences';

/*
	This component is used to generate Results via List.
	For smaller screen we use HorizontalCard to generate a List
	layout whereas for large screen we use VerticalCard to generate
	Card Layout.

	You can override the default props by using reactiveListProps at L29.
*/

const headingStyles = css`
	margin-bottom: 30px;
`;
const listStyles = css`
	margin-bottom: 80px;
`;

const preferences = getPreferences();

const List = (props) => {
	const { title, page } = props;
	// ResultsLayoutByCategory depends upon the current page
	preferences.pageSettings.currentPage = page;

	return (
		<React.Fragment>
			{title && <h2 className={headingStyles}>{title}</h2>}
			<ResultsLayoutByCategory
				preferences={preferences}
				componentProps={{
					innerClass: {
						pagination: css({
							display: 'none',
						}),
						poweredBy: css({
							display: 'none !important',
						}),
						sortOptions: 'results-sort-options',
					},
					className: listStyles,
				}}
			/>
		</React.Fragment>
	);
};

export default List;
