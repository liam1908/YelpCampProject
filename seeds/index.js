const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const fetch = require('node-fetch');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = (array) => array[Math.floor(Math.random() * array.length)];

// const gettingPicture = async () => {
//     const clientID = "NB9Mm-Q_qe-nzZGiFaVsqYQuvbjoonPKflau5uUdMew";
//     const endpoint = `https://api.unsB9Mm-plash.com/photos/random?collections=483251&client_id=${clientID}`;
//     fetch(endpoint)
//         .then(res => {
//             res.json()
//                 .then(data => {
//                     const jsonObject = data;
//                     console.log(jsonObject.urls.small);
//                     return String(jsonObject.urls.small);
//                 })
//                 .catch(err => {
//                     return err;
//                 })
//         })
//         .catch(err => {
//             return err;
//         })
// }

const getPicture = async () => {
    const clientID = "3HWju4_mCmUHqYmu__G9uAxoKPABeqVf30AfoKDgU58";
    const endpoint = `https://api.unsplash.com/photos/random?collections=483251&client_id=${clientID}`;
    try {
        let response = await fetch(endpoint);
        let data = await response.json();

        return data.urls.small;

    } catch (error) {
        throw new Error("Failed to fetch");
    }

}

// const getPicUrl = async () => {
//     getPicture()
//         .then((data) => {
//             console.log(data.urls.small);
//             return (data.urls.small);
//         })
//         .catch((error) => {
//             return (error);
//         })
// }




const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        //const picUrl = await getPicture();
        //console.log(picUrl);
        const camp = new Campground({
            author: '632dcd53ffea6e13ca935704',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dqfqvkdou/image/upload/v1666711254/YelpCamp/jwjnotvzvhojiky9pjgm.jpg',
                    filename: 'YelpCamp/jwjnotvzvhojiky9pjgm',

                },
                {
                    url: 'https://res.cloudinary.com/dqfqvkdou/image/upload/v1666711263/YelpCamp/zojbseoxrlqoqxbf1zgt.jpg',
                    filename: 'YelpCamp/zojbseoxrlqoqxbf1zgt',

                }
            ],
            geometry:
            {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            //image: await gettingPicture(),
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi ea natus ex provident ullam illum reiciendis adipisci utillo facilis perspiciatis, quaerat quisquam voluptas et quibusdam mollitia ipsam sequi minus?',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

