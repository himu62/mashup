var App = React.createClass({
	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
		this.state = {
			keyword: '',
			offset:  0,
			r18:     false,
			results: []
		};
	}

	submit() {
		$.ajax({
			method: 'GET',
			url: 'http://api.gifmagazine.net/v1/gifs/search',
			data: {
				q: '',
				limit: 30,
				offset: this.state.offset,
				safe: this.state.r18 ? 1 : 0
			}
		})
		.done(function(data) {
			for i in data.data {
				this.state.results.push(data[i].image.small.url);
			}
			this.state.offset = data.pagination.offset + data.pagination.total_count * 30;
			this.setState(this.state);
		})
		.fail(function() {
			this.submit();
		});
	}

	render() {
		var results = this.state.results.map(function(url) {
			return <img src={url} />;
		});

		return (
			<div className="app">
				<h1>GIFアニメ検索してくれるやつ</h1>
				<form onSubmit={this.submit}>
					<input type="text" value={this.state.keyword} />
					<button type="button" onClick={this.submit}>検索</button>
				</form>
				<div className="results">
					{results}
				</div>
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
