import agent from '../../utils/agent';

export const sendMessage = (payload) => {
    return agent.push(`/messages/`, payload);
};

export const loadMessages = () => {
    return agent.get(`/messages/`, payload);
};