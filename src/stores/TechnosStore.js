import { observable, action, runInAction } from "mobx";
import TechnosApi from '../api/TechnosApi';

class TechnosStore {
	@observable technos = {
		nodes:[],
		links:[]
	};

	technosApi = new TechnosApi();

	addTechno(techno) {
		this.technos.push(techno);
	}

	@action.bound
	getTechnos(name) {
		this.technosApi.getTechnos(name).then(res => {
			runInAction(() => {
				this.technos.nodes = res.nodes;
				this.technos.links = res.links;
			})
		});
	}
}

const technosStore = new TechnosStore();

export default technosStore;