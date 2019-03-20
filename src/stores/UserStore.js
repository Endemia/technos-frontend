import { observable, action } from "mobx";

class UserStore {
	@observable user = {};

	@action.bound
	setUser(user) {
		this.user = user;
	}
}

const userStore = new UserStore();

export default userStore;