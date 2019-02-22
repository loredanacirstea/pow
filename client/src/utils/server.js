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
}
