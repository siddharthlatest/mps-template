import React from 'react';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { css } from '@emotion/css';
import { withStyles, Grid, CircularProgress } from '@material-ui/core';

import Navbar from '../components/Navbar';

import { getDescriptionFromAPI } from '../utils';

const notFound = css`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.back-button {
		margin-top: 20px;
	}
`;

const spinner = css`
	position: absolute;
	top: 50%;
	left: 50%;
`;

const styles = () => ({
	root: {
		width: '95%',
		margin: '80px auto 15px',
		padding: '20px',
		border: '1px solid #d9d9d9',
		borderRadius: '2px',
	},
});

/*
	This component is use to render Detail Details.
	Here we are fetching details for specific book by its id using appbase-js.
	And as we dont have proper description of every book, we are calling DuckDuckGo
	API to fetch this detail.
*/

class Detail extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoading: true,
			item: { title: '', description: '', image: '', price: '' },
			loadingDescription: false,
		};
	}

	componentDidMount() {
		this.loadDetail();
	}

	componentDidUpdate(prevProps) {
		const {
			location: { pathname },
		} = prevProps;
		const {
			location: { pathname: newPath },
		} = this.props;

		if (newPath !== pathname) {
			this.loadDetail();
		}
	}

	getLink = () => {
		const {
			location: {
				state: { item },
			},
		} = this.props;
		const parsedTitle = item.title && item.title.split(' ').join('+');

		return `https://www.google.com/search?q=${parsedTitle}`;
	};

	loadDetail = async () => {
		const {
			location: {
				state: { item },
			},
		} = this.props;
		this.setState({
			isLoading: true,
			item: { title: '', description: '', image: '', price: '' },
		});

		if (item.title) {
			this.setState({
				item,
				isLoading: false,
				loadingDescription: true,
			});
			const description = await getDescriptionFromAPI(item.title);
			this.setState({
				item: { ...item, description: description || item.description },
				isLoading: false,
				loadingDescription: false,
			});
		} else {
			this.setState({
				isLoading: false,
			});
		}
	};

	render() {
		// eslint-disable-next-line
		const { isLoading, item, loadingDescription } = this.state;
		const { history, classes } = this.props;

		/* eslint-disable no-nested-ternary */
		return (
			<React.Fragment>
				<Navbar hideShowButton={false} page="search" />
				{isLoading ? (
					<div
						className={spinner}
						style={{
							position: 'absolute',
							width: '200px',
							left: '50%',
							top: '50%',
						}}
					>
						<CircularProgress />
						<div
							style={{
								position: 'absolute',
								left: '-10%',
								top: '100%',
							}}
						>
							<Typography component="h6" variant="body2" color="textSecondary">
								fetching data...
							</Typography>
						</div>
					</div>
				) : item ? (
					<Grid container spacing={24} className={classes.root}>
						<Grid item md={2} sm={4}>
							<img style={{ width: '100%' }} src={item.image} alt={item.title} />
						</Grid>
						<Grid item md={10} sm={12}>
							<Typography component="h5" variant="h5" color="textPrimary">
								{item.title}
							</Typography>
							<Typography component="h6" variant="h6" color="textSecondary">
								{item.price}
							</Typography>
							<Typography component="p" variant="h6" color="textSecondary">
								{loadingDescription ? (
									<div>
										<div
											style={{
												marginLeft: '35px',
											}}
										>
											<CircularProgress />
										</div>

										<Typography
											component="h6"
											variant="body2"
											color="textSecondary"
										>
											fetching description...
										</Typography>
									</div>
								) : (
									<p>{item.description}</p>
								)}
							</Typography>
							<a href={this.getLink()} target="_blank" rel="noopener noreferrer">
								Search on Web
							</a>
						</Grid>
					</Grid>
				) : (
					<div className={notFound}>
						<Button
							size="large"
							className="back-button"
							onClick={() => history.push('/')}
						>
							<Icon type="arrow-left" />
							Go back
						</Button>
					</div>
				)}
			</React.Fragment>
		);
		/* eslint-enable no-nested-ternary */
	}
}

export default withStyles(styles)(Detail);
