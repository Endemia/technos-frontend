import apolloFetch from './ApolloFetch'

class AuthenticationApi {

	login(login, password) {
		const query = `
			mutation {
  				login(login: "${login}", password:"${password}")
			}
		`
		return apolloFetch({ query })
  			.then(function (response) {
  				if (response.data.login) {
			    	return response.data.login;
			    } else {
			    	throw new Error("Invalid credentials.");
			    }
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}
}

export default AuthenticationApi;