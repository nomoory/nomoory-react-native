import agent from '../../utils/agent';

export const sendMessage = ({ message }) => {
    return agent.post(`/messages/`, { message });
};

export const loadMessages = () => {
    return agent.get(`/messages/`);
};