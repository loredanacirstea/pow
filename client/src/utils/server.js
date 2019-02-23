export default class ResourceServer {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    setHttpClient(httpClient) {
        this.httpClient = httpClient;
    }

    getResources() {
        const url = `${this.baseUrl}/resource`;
        return this.httpClient.get(url);
    }

    getResource(id) {
        const url = `${this.baseUrl}/resource/${id}`;
        return this.httpClient.get(url);
    }

    getOwnVotes(resourceid) {
        const url = `${this.baseUrl}/resource/${resourceid}/count/vote`;
        return this.httpClient.get(url);
    }

    getVotes(
        resourceid,
        startTimestamp = 0,
        endTimestamp = new Date().getTime(),
    ) {
        console.log('getVotes API', startTimestamp, new Date(startTimestamp), endTimestamp, new Date(endTimestamp));
        const url = `${this.baseUrl}/vote?filter={"where":{"and":[{"resourceid":"${resourceid}"},{"timestamp":{"gt":${startTimestamp}}},{"timestamp":{"lt":${endTimestamp}}}]}}`;
        return this.httpClient.get(url);
    }

    vote(resourceid, optionid) {
        const url = `${this.baseUrl}/resource/${resourceid}/vote/${optionid}`;
        return this.httpClient.get(url);
    }
}
