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
				this.technos.nodes = this.formatNodes(res);
				this.technos.links = this.formatLinks(res);
			})
		});
	}

	formatNodes(toFormat) {
		if (!toFormat) return;

		const nodes = [];
		toFormat.forEach(node => {
			nodes.push(node.name);
			if (node.children) {
				node.children.forEach(child => {
					nodes.push(child.name);
				})
			}
		})
		return Array.from(new Set([...nodes]));
	}

	formatLinks(toFormat) {
		if (!toFormat) return;

		const links = [];
		toFormat.forEach(node => {
			if (node.children) {
				node.children.forEach(child => {

					let alreadyPresent = links.filter(l => l.from === node.name && l.to === child.name);
					if (alreadyPresent.length === 0) {
						links.push({from: node.name, to: child.name});
					}
				})
			}
		})
		console.log(links);
		return links;
	}
}

const technosStore = new TechnosStore();

export default technosStore;
