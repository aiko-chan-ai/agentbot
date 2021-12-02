const { addMoney, subtractMoney, fetchMoney } = require('../../functions/economy');
const random = require('random-number-csprng');
const subtractReasonList = [
    "Bạn đang đứng đường thì bị công an bắt và bị phạt {money} Agent money.",
    "Sau khi bạn phục vụ thì bị khách quỵt mất {money} Agent money.",
    "Bạn vừa phát hiện khách bạn bị HIV, đi chữa mất {money} Agent money.",
    "Đang phục vụ thì bị đưa đi cách ly bắt buộc, tốn mất {money} Agent money.",
    "Bạn sau khi làm xong thì bị nhà nghỉ chém giá, lỗ mất {money} Agent money.",
];
module.exports = {
    name: 'slut',
    category: 'gamble',
    description: 'Kiếm tiền nhiều hơn lệnh `work` nhưng sẽ có tỉ lệ thua',
    usage: 'slut',
    cooldown: 300,
    run: async (client, message, args) => {
        const authorID = message.author.id;
        const userMoney = await fetchMoney(authorID);
        if (userMoney == 0) return message.channel.send('Bạn không có tiền để sử dụng lệnh này!');
        let randomNum = await random(2000, 4000);
        /*
        0: thua
        1: thắng
        */
       const status = await random(0, 1);
       if (status === 1) {
            await addMoney(authorID, randomNum);
            message.channel.send(`Bạn đã nhận được: 💵 \`${randomNum}\` Agent money.`);
       } else {
           randomNum = await random(500, 2000);
           if (userMoney < randomNum) randomNum = userMoney;
           const reasonNum = await random(0, subtractReasonList.length - 1);
           message.channel.send(`${subtractReasonList[reasonNum].replace('{money}', `\`${randomNum}\``)} 😢`);
       }
    },
};