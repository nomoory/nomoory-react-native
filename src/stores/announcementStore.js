import { observable, action, computed } from 'mobx';
import AnnouncementModel from './models/AnnounceModel';
import agent from '../utils/agent';

class AnnouncementStore {
    @observable
    loadValues = {
        isLoading: false,
        nextUrl: null,
        isFirstLoad: true
    }

    @observable
    announcementRegistry = observable.map();

    @observable
    announcement = null;

    @computed
    get announcements() {
        let announcements = [];
        this.announcementRegistry.forEach((announcement) => {
            announcements.push(announcement);
        });
        // announcements = this._sortAnnouncements(announcements);
        return announcements;
    }

    _sortAnnouncements(announcements) {
        return announcements.sort((prev, next) => {
            return Date(prev.modified) > Date(next.modified);
        });
    }

    getAnnouncementById(id) {
        return this.announcementRegistry.get(id);
    }

    @action
    loadAnnouncementById(id) {
        this.loadValues.isLoading = true;
        this.announcement = null;        
        return agent.loadAnnouncementById(id)
            .then(action((response) => {
                this.announcement = new AnnouncementModel(response.data);
                this.loadValues.isLoading = false;
            }))
            .catch(action((err) => {
                this.loadValues.isLoading = false;
                throw err;
            }));
    }

    @action
    loadAnnouncementList() {
        this.loadValues.isLoading = true;
        this.errors = null;
        return agent.loadAnnouncementList()
            .then(action((response) => {
                let { results, next, previous } = response.data;
                results.forEach((announcement) => {
                    this.announcementRegistry.set(
                        announcement.uuid,
                        new AnnouncementModel(announcement)
                    );
                });
                this.loadValues = {
                    isFirstLoad: false,
                    nextUrl: next,
                    isLoading: false
                };
            }))
            .catch(action((err) => {
                this.loadValues.isLoading = false;
                throw err;
            }));
    }

    @action
    loadNextAnnouncementList() {
        if (this.loadValues.nextUrl) {
            this.loadValues.isLoading = true;
            return agent.get(this.loadValues.nextUrl)
                .then(action((response) => {
                    let { results, next, previous } = response.data;
                    results.forEach(action((announcement) => {
                        this.announcementRegistry.set(
                            announcement.uuid,
                            new AnnouncementModel(announcement)
                        );
                    }));
                    this.loadValues = {
                        isFirstLoad: false,
                        nextUrl: next,
                        isLoading: false
                    };
                }))
                .catch(action((err) => {
                    this.loadValues.isLoading = false;
                    throw err;
                }));
        }
    }
}

export default new AnnouncementStore();
