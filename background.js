browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({"url": "/editor.html"});
});

const defaultColors = [
  {
    slug: "toolbar",
    name: "Toolbar Color",
    h: 180,
    s: 44,
    l: 96
  },
  {
    slug: "toolbar_text",
    name: "Toolbar Text Color",
    h: 174,
    s: 42,
    l: 65
  },
  {
    slug: "accentcolor",
    name: "Tab Bar Background Color",
    h: 360,
    s: 100,
    l: 100
  },
  {
    slug: "textcolor",
    name: "Background Tab Text Color",
    h: 174,
    s: 42,
    l: 65
  },
  {
    slug: "toolbar_field",
    name: "Toolbar Input Background Color",
    h: 360,
    s: 100,
    l: 100
  },
  {
    slug: "toolbar_field_text",
    name: "Toolbar Input Text Color",
    h: 174,
    s: 42,
    l: 65
  },
]

const colors = [];
const theme = {
  "images": {
    "headerURL":"pixel.gif"
  },
  "colors": {}
};

const getColors = browser.storage.local.get();

getColors.then((store) => {
  console.log(store);
  if( typeof store.colors === 'undefined') {
    for (let color of defaultColors) {
      colors.push(color);
    }
  } else {
    for(let color of store.colors) {
      colors.push(color);
    }
  }
  updateTheme(colors, theme);
  setTheme(theme);
});


const updateTheme = (colors, theme) => {
  for(let color of colors) {
    theme.colors[color.slug] = `hsl(${color.h},${color.s}%,${color.l}%)`;
  }
}

const setTheme = (theme) => {
  browser.theme.update(theme);
}

let port;

function connected(p) {
  port = p;
  port.postMessage({colors: colors});
  port.onMessage.addListener(function(message) {
    if (message.type === 'update') {
      const {index, target, value} = message;
      colors[index][target] = value;
    }
    browser.storage.local.set({colors});
    updateTheme(colors, theme);
    setTheme(theme);
  });
}

browser.runtime.onConnect.addListener(connected);
