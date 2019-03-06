import axios from 'axios';

class AppService {
    generatePage(data) {
        return axios({
            method: 'POST',
            url: '/generatePage',
            data,
        });
    }
}

export default AppService;