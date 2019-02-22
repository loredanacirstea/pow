import ResourceServer from './utils/server';

const PoP = {
    server: new ResourceServer(process.env.VUE_APP_SERVER_IP),
};

export default PoP;
