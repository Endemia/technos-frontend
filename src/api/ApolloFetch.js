import { createApolloFetch } from 'apollo-fetch'

class ApolloFetch {

	constructor() {
		const uri= 'http://localhost:8080/graphql';
		this.apolloFetch = createApolloFetch({ uri });

		this.apolloFetch.use(({ request, options }, next) => {
  			if (!options.headers) {
    			options.headers = {};  // Create the headers object if needed.
  			}
  			const token = sessionStorage.getItem('user');
  			if (token) {
  				options.headers['authorization'] = 'Bearer ' + token;
  			}
			next();
		});
	}
}

export default new ApolloFetch().apolloFetch;