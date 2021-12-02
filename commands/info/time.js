const axios = require('axios');
const { GEOLOCATION, TIMEZONEDB } = process.env;
module.exports = {
    name: 'time',
    category: 'info',
    description: 'Xem giờ ở một vị trí nào đó',
    usage: '<PREFIX>time <nhập địa chỉ, zipcode, hay gì cũng được>',
    example: '<PREFIX>time Dallas,TX',
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('Ghi tên thành phố hoặc địa chỉ của bạn!.');
        const search = encodeURIComponent(args.join(' '));
        try {
            let googleData = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=${GEOLOCATION}`);
            googleData = googleData.data;
            if (googleData.status == 'ZERO_RESULTS') return message.channel.send('Từ khoá bạn vừa nhập không có trong bản đồ!');
            if (googleData.status == 'REQUEST_DENIED') throw new Error('Cần thay đổi API KEY của ggeolocation!');
            googleData = googleData.results[0];
            if (googleData.geometry) {
                const geo = googleData.geometry;
                let timedb = await axios.get(`http://api.TIMEZONEDB.com/v2.1/get-time-zone?key=${TIMEZONEDB}&format=json&by=position&lat=${geo.location.lat}&lng=${geo.location.lng}`);
                timedb = timedb.data;
                message.channel.send(`Múi giờ ${timedb.zoneName}, ${timedb.formatted}`);
            }
        }
        catch(e) {
            console.log(e);
            message.channel.send('Bot lỗi khi đang cố gắng truy xuất dữ liệu, vui lòng thử lại sau!');
        }
    },
};