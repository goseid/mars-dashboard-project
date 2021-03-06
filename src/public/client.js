let store = {
  user: { name: "Student" },
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit", "Perseverance"],
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers, apod } = state;
  return `
        <header>${roverButtons(rovers)}</header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
// Pure function that renders rover buttons
const roverButtons = (rovers) => {
  const reducer = (a, c) =>
    (a += `<button class="btn-rover" onClick="roverButtonHandler('${c}')" >${c}</button>`);
  return rovers.reduce(reducer, "");
};

const roverButtonHandler = (rover) => {
  console.log("roverButtonHandler called by:", rover);
  getPhotos(rover);
};
// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // if apod doesn't already exist, request it
  if (!apod.image) {
    getImageOfTheDay(store);
    return;
  }
  // If image is not from today -- request it again
  const today = new Date();
  const photoDate = new Date(apod.image.date + "T00:00:00"); // Adding this string forces parsing in the local time zone
  if (photoDate.getDate() !== today.getDate()) {
    getImageOfTheDay(store);
  } else {
    // check if the photo of the day is actually type video!
    if (apod.image.media_type === "video") {
      return `
            <p>See today's featured video <a href="${apod.image.url}">here</a></p>
            <p>${apod.image.title}</p>
            <p>${apod.image.explanation}</p>
        `;
    } else {
      return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
    }
  }
};

// ------------------------------------------------------  API CALLS

const getPhotos = (rover, state) => {
  console.log("fetching...", rover);
  fetch(`http://localhost:3000/rovers?rover=${rover}`)
    .then((res) => res.json())
    .then((data) => console.dir(data));
};
// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  // console.log to manifest run away requests
  console.log("Requested apod image at", Date());
  return;
};
