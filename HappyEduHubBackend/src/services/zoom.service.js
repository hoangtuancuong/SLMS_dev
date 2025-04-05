import axios from 'axios';

let accessToken;

const zoomService = {
    init: async () => {
        const clientId = process.env.ZOOM_CLIENT_ID;
        const clientSecret = process.env.ZOOM_CLIENT_SECRET;
        const accountId = process.env.ZOOM_ACCOUNT_ID;
        const basicToken = Buffer.from(clientId + ':' + clientSecret).toString('base64');
        console.log(basicToken);
        console.log(accountId);
        await axios.post( `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, undefined, {
            headers: {
                "Authorization": "Basic " + basicToken
            }
        })
            .then(response => {
                accessToken = response.data.access_token;
                console.log('Access Token:', accessToken);
            })
            .catch(error => {
                console.error('Error:', error.response.data);
            });
        await zoomService.createMeeting({
            topic: 'Test Meeting',
            type: 1,
            start_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
            duration: 30
        });
    },

    createMeeting: async (params) => {
        const response = await axios.post(`https://api.zoom.us/v2/users/me/meetings`, params, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        });
        console.log(response.data);
        return {
            uuid: response.data.uuid,
            host_email: response.data.host_email,
            topic: response.data.topic,
            type: response.data.type,
            status: response.data.status,
            password: response.data.password,
            start_url: response.data.start_url,
            join_url: response.data.join_url,
            created_at: response.data.created_at,
        };
    }
}

export default zoomService;
