const { Location } = require("./models/location");
const { Staff } = require("./models/staff");
const mongoose = require("mongoose");
const faker = require("faker");

async function seed() {
  const credentials = [
    "MD",
    "DO",
    "MD PHD",
    "DO PHD",
    "MD MsC",
    "DO MsC",
    "MD MBA",
    "DO MBA",
    "ARNP",
    "AuD",
    "DC",
    "DDS",
    "DMD",
    "DPM",
    "DPT",
    "DScPT",
    "DSN",
    "DVM",
    "ENT",
    "GP",
    "GYN",
    "MS",
    "OB/GYN",
    "PharmD"
  ];
  const locationIDS = [
    { _id: "5be720d907d3dbed6318f3ef", name: "Rotating" },
    { _id: "5be720de07d3dbed6318f3f0", name: "Admin" },
    { _id: "5be720e107d3dbed6318f3f1", name: "Bellevue" },
    { _id: "5be720e707d3dbed6318f3f2", name: "Bothell" },
    { _id: "5be720ed07d3dbed6318f3f3", name: "Factoria" },
    { _id: "5be720f607d3dbed6318f3f4", name: "Remdond" },
    { _id: "5be720fd07d3dbed6318f3f5", name: "Redmond Ridge" },
    { _id: "5be7210307d3dbed6318f3f6", name: "Sammamish" },
    { _id: "5be7210a07d3dbed6318f3f7", name: "Issaquah Highlands" },
    { _id: "5be7211607d3dbed6318f3f8", name: "Totem Lake" }
  ];
  const days = [
    "Varies",
    "Monday Tuesday Wednesday",
    "Monday Wednesday",
    "Tuesday Wednesday",
    "Monday Friday",
    "Tuesday Thursday",
    "Weekends",
    "Sunday Monday",
    "Sunday Monday Tuesday Wednesday",
    "Friday",
    "Thursday Friday"
  ];
  const languages = [
    "English Italian Latin",
    "English Spanish",
    "English",
    "English French",
    "English Chinese"
  ];
  const gender = ["Male", "Female", "Non-Binary"];
  console.log("hello");

  await mongoose.connect(
    "mongodb://testuser:Icone261!!@ds041157.mlab.com:41157/schedule-binder"
  );

  for (let index = 0; index < 200; index++) {
    let locationIndex = await Math.floor(Math.random() * locationIDS.length);
    let inOfficeIndex = await Math.floor(Math.random() * days.length);
    let languageIndex = await Math.floor(Math.random() * languages.length);
    let genderIndex = await Math.floor(Math.random() * gender.length);
    let photoIndex = (await Math.floor(Math.random() * 100)) + 2;
    let credIndex = await Math.floor(Math.random() * credentials.length);

    console.log(
      "##############INDEXES",
      credIndex,
      locationIndex,
      inOfficeIndex,
      languageIndex,
      genderIndex,
      photoIndex
    );
    let staffs = new Staff({
      bio: faker.lorem.paragraphs(2),
      credentials: credentials[credIndex],
      daysInOffice: days[inOfficeIndex],
      education: faker.lorem.words(3),
      gender: gender[genderIndex],
      languages: languages[languageIndex],
      location: locationIDS[locationIndex],
      name: faker.name.findName(),
      profileUrl: `https://picsum.photos/600/600?image=${photoIndex}`,
      special: faker.lorem.paragraph(),
      wellcheck: faker.random.number({
        min: 10,
        max: 50
      })
    });
    staffs = await staffs.save();
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
