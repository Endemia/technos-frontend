import { observable, action, runInAction } from "mobx";
import TechnosApi from '../api/TechnosApi';

class SearchStore {
	@observable query="";
	@observable creationDisabled=true;
	@observable existingTechnos=[];

	technosApi = new TechnosApi();

	setQuery(query) {
		this.query = query;
	}

	@action.bound
	getExistingTechnos(name) {
		this.technosApi.getTechnos(name, false, 0).then(res => {
			runInAction(() => {
				this.existingTechnos.replace(this.sortTechnosByName(res));
				const exactMatchExists = res.filter(techno => {
					return techno.name.toLowerCase() === name.toLowerCase();
				});
				if (exactMatchExists.length > 0) {
					this.creationDisabled = true;
				} else {
					this.creationDisabled = false;
				}
			})
		});
	}

	@action.bound
	clearExistingTechnos() {
		this.existingTechnos.clear();
	}

	sortTechnosByName(technos) {
		return technos.sort(function(a,b) {
			var x = a.name.toLowerCase();
			var y = b.name.toLowerCase();
			return x < y ? -1 : x > y ? 1 : 0;
		})
	}

}

const searchStore = new SearchStore();

export default searchStore;