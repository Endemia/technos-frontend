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

	isLoginAvailable(login) {
		const query = `
			{
  				isLoginAvailable(login: "${login}")
			}
		`
		return apolloFetch({ query })
  			.then(function (response) {
		    	return response.data.isLoginAvailable;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	register(login, password, nom, prenom, email) {
		const query = `
			mutation {
  				register(login: "${login}", password:"${password}", nom:"${nom}", prenom:"${prenom}", email:"${email}")
			}
		`
		return apolloFetch({ query })
  			.then(function (response) {
  				if (response.errors) {
  					throw new Error(response.errors[0].message);
  				} else {
		    		return response.data.register;
		    	}
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	activate(login, registerKey) {
		const query = `
			mutation {
				activate(login: "${login}", registerKey:"${registerKey}")
			}
		`

		return apolloFetch({ query })
  			.then(function (response) {
		    	return response.data.activate;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}
}

export default AuthenticationApi;