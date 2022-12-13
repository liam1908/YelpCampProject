const fetch = require('node-fetch');
let imageUrl = "hello";

const getPicture = async () => {
    const clientID = "e8w-fkuw1SafAUD7D06muRbfAqsYZK0MXdEUHywr95A";
    const endpoint = `https://api.unsplash.com/photos/random?collections=483251&client_id=${clientID}`;
    try {
        let response = await fetch(endpoint);
        let data = await response.json();
        return data;

    } catch (error) {
        throw new Error("Failed to fetch");
    }

}

getPicture()
    .then((data) => {
        console.log(data);
        console.log(data.urls.small);
        console.log(typeof (data.urls.small));
    })
    .catch((error) => {
        console.log(error);
    })
// function gettingUnplashPic(resolve, reject) {
//     const clientID = "e8w-fkuw1SafAUD7D06muRbfAqsYZK0MXdEUHywr95A";
//     const endpoint = `https://api.unsplash.com/photos/random?collections=483251&client_id=${clientID}`;
//     fetch(endpoint)
//         .then(res => {
//             res.json()
//                 .then(data => {
//                     const jsonObject = data;
//                     //console.log(jsonObject.urls.small);
//                     resolve(String(jsonObject.urls.small));
//                 })
//                 .catch(err => {
//                     //console.log(err);
//                     reject(err);
//                 })
//         })
//         .catch(err => {
//             //console.log(err);
//             reject(err);
//         })
// }

// const gettingPicPromise = new Promise((resolve, reject) => {
//     gettingUnplashPic(resolve, reject);
// })

// gettingPicPromise
//     .then((data) => {
//         console.log(data);
//         console.log(typeof (data));
//     })
//     .catch(err => console.log(err));

// const gettingPicture = async () => {
//     const clientID = "e8w-fkuw1SafAUD7D06muRbfAqsYZK0MXdEUHywr95A";
//     const endpoint = `https://api.unsplash.com/photos/random?collections=483251&client_id=${clientID}`;
//     fetch(endpoint)
//         .then(res => {
//             res.json()
//                 .then(data => {
//                     const jsonObject = data;
//                     //console.log(jsonObject.urls.small);
//                     return String(jsonObject.urls.small);
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     return err;
//                 })
//         })
//         .catch(err => {
//             console.log(err);
//             return err;
//         })
// }
// gettingPicture()
//     .then(data => {
//         imageUrl = data;
//         console.log(imageUrl);
//     })



// const exportPictureUrl = async () => {
//     imageUrl = await gettingPicture();
// }

// exportPictureUrl()
//     .then(() => {
//         console.log(imageUrl);
//         console.log("Done");
//     })

// gettingPicture().then(() => {
//     console.log("Done");
// })

// const clientID = "e8w-fkuw1SafAUD7D06muRbfAqsYZK0MXdEUHywr95A";
// const endpoint = `https://api.unsplash.com/photos/random?collections=483251&client_id=${clientID}`;
// fetch(endpoint)
//     .then(res => {
//         res.json()
//             .then(data => {
//                 const jsonObject = data;
//                 console.log(jsonObject.urls.small);
//                 //return String(jsonObject.urls.small);
//             })
//             .catch(err => {
//                 console.log(err);
//                 //return err;
//             })
//     })
//     .catch(err => {
//         console.log(err);
//         //return err;
//     })

