import axios from 'axios';
import agent from '../../utils/agent';

export const url = `${Expo.Constants.manifest.extra.RAZZLE_CHATTING_API_ENDPOINT}/messages`;

export const sendMessage = ({ content }) => {
    const config = agent.requestConfig;
    return axios
        .post(url, { content }, config)
        .catch((err) => {
            console.log({err});
        });
};

export const loadMessages = () => {
    const config = agent.requestConfig;
    return axios
        .get(url, config)
};
