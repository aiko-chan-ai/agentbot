const { MessageEmbed } = require("discord.js");
const { KSoftClient } = require('ksoft.js');
const ksoft_key = process.env.KSOFTKEY;
const { images } = new KSoftClient(ksoft_key);
module.exports = {
    name: "food",
    category: "images",
    description: "Gởi ảnh thức ăn từ reddit",
    usage: "<PREFIX>food",
    run: async (client, message, args) => {
        const subReddits = ["appetizers", "asianeats", "BBQ", "bento", "BreakfastFood", "burgers", "cakewin", "Canning", "cereal", "charcuterie", "Cheese", "chinesefood", "cider", "condiments", "curry", "culinaryplating", "cookingforbeginners", "cookingwithcondiments", "doener", "eatwraps", "fastfood", "fishtew", "fried", "GifRecipes", "grease", "hot_dog", "icecreamery", "irish_food", "JapaneseFood", "jello", "KoreanFood", "FoodPorn", "meat", "pasta", "pizza", "ramen", "seafood", "spicy", "steak", "sushi", "sushiroll", 'Vitamix'];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        try {
            const img = await images.reddit(random, { removeNSFW: true, span: 'month' });
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setImage(img.url)
                .setTitle(`Từ /r/${random}`)
                .setURL(img.post.link)
                .setFooter(`Upvote: ${img.post.upvotes} | Downvote: ${img.post.downvotes}`);
            message.channel.send(embed);
        } catch(e) {
            message.channel.send(`Bot lỗi: \`${e.message}\`, vui lòng thử lại sau!`);
        }
    },
};