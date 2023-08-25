import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { SingleList } from '@appbaseio/reactivesearch';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
	root: {
		width: '280px',
		margin: '10px',
		height: '232px',
		overflowY: 'scroll',
		border: '1px solid #d9d9d9',
	},
	title: {
		fontWeight: '600',
		fontSize: '1rem',
		color: '#424242',
		position: 'sticky',
		top: 0,
		background: 'white',
		borderBottom: '1px solid #d9d9d9',
		padding: '5px 10px',
		zIndex: '2',
	},
});

/*
	This component can be used inside ReactiveComponent to generate an UI for
	SingleList using List Component of Material UI.

	For MultiList you can modify this component to track multiple values in state.
*/

class ListComponent extends React.Component {
	componentDidUpdate(prevProps) {
		const { selectedValue } = prevProps;
		const { selectedValue: newValue, setQuery, dataField } = this.props;

		if (newValue !== selectedValue) {
			const query = SingleList.defaultQuery(newValue, {
				queryFormat: 'or',
				dataField,
			});
			setQuery({
				query,
				value: newValue,
			});
		}
	}

	handleChange = selectedItem => {
		const { setQuery, dataField } = this.props;
		const query = SingleList.defaultQuery(selectedItem, {
			queryFormat: 'or',
			dataField,
		});
		setQuery({
			query,
			value: selectedItem,
		});
	};

	render() {
		const { selectedValue, classes } = this.props;
		const { dataField, key, title, listComponentProps, aggregations } = this.props;
		let items = [];
		if (aggregations && aggregations[dataField] && aggregations[dataField].buckets.length) {
			/* eslint-disable camelcase */
			items = aggregations[dataField].buckets.map(({ key: itemKey, doc_count }) => ({
				value: itemKey,
				count: doc_count,
			}));
			/* eslint-enable camelcase */
			items = items.filter(({ value }) => value !== '');
		}

		return (
			<div className={classes.root}>
				{title && (
					<Typography
						component="h6"
						variant="h6"
						className={classes.title}
						color="textPrimary"
					>
						{title}
					</Typography>
				)}
				<List key={key} {...listComponentProps}>
					{items.map(item => (
						<ListItem
							key={item.value}
							style={{
								background: selectedValue === item.value ? '#e8e8e8' : 'inherit',
								paddingTop: '2px',
							}}
							onClick={() => this.handleChange(item.value)}
						>
							<ListItemText primary={item.value} />
						</ListItem>
					))}
				</List>
			</div>
		);
	}
}

export default withStyles(styles)(ListComponent);
