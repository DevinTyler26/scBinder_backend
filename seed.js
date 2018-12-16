const { Location } = require("./models/location");
const { Provider } = require("./models/provider");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Comedy",
    providers: [
      { name: "Airplane", daysInOffice: 5, languages: 2 },
      { name: "The Hangover", daysInOffice: 10, languages: 2 },
      { name: "Wedding Crashers", daysInOffice: 15, languages: 2 }
    ]
  },
  {
    name: "Action",
    providers: [
      { name: "Die Hard", daysInOffice: 5, languages: 2 },
      { name: "Terminator", daysInOffice: 10, languages: 2 },
      { name: "The Avengers", daysInOffice: 15, languages: 2 }
    ]
  },
  {
    name: "Romance",
    providers: [
      { name: "The Notebook", daysInOffice: 5, languages: 2 },
      { name: "When Harry Met Sally", daysInOffice: 10, languages: 2 },
      { name: "Pretty Woman", daysInOffice: 15, languages: 2 }
    ]
  },
  {
    name: "Thriller",
    providers: [
      { name: "The Sixth Sense", daysInOffice: 5, languages: 2 },
      { name: "Gone Girl", daysInOffice: 10, languages: 2 },
      { name: "The Others", daysInOffice: 15, languages: 2 }
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.DB);

  await Provider.deleteMany({});
  await Location.deleteMany({});

  for (let location of data) {
    const { _id: locationId } = await new Location({
      name: location.name
    }).save();
    const providers = location.providers.map(provider => ({
      ...provider,
      location: { _id: locationId, name: location.name }
    }));
    await Provider.insertMany(providers);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
