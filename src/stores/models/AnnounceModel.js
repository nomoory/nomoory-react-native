import { action, observable } from 'mobx';
import Model from './Model';
import agent from '../../utils/agent';

class AnnounceModel extends Model {
    @observable
    isLoading = false;

    @action
    loadAnnouncement() {
        this.isLoading = true;
        this.announcement = null;      
        return agent.loadAnnouncementById(this.uuid)
            .then(action((response) => {
                let announcementDetail = response.data;
                Object.keys(announcementDetail).forEach((key) => {
                    this[key] = announcementDetail[key];
                })
                this.isLoading = false;
            }))
            .catch(action((err) => {
                this.isLoading = false;
                throw err;
            }));
    }
}

export default AnnounceModel;
