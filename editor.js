const port = browser.runtime.connect({name:"color port"});

let appColors = [];

port.onMessage.addListener((message) => {
  initSliders(message.colors);
  bindInputs();
});


// get default colors from background and set original slider values
const initSliders = (colors) => {
  let i = 0;
  for (color of colors) {
    console.log(color);
    appColors.push(color);
    $('.picker-sets').append(`
      <form class='picker-set' id=${color.slug} data-unit=${i}>
        <h2>${color.name}</h2>
        <label>hue</label>
        <input type='range' min='0' max='360' class='h' value=${color.h} />
        <label>saturation</label>
        <input type='range' min='0' max='100' class='s' value=${color.s} />
        <label>lightness</label>
        <input type='range' min='0' max='100' class='l' value=${color.l} />
      </form>`
    );
    i++;
  };

  $('.picker-set').each(function(index){
    setColorsOnSlider(appColors[index], $(this));
  });
};

// bind changes to each slider
const bindInputs = () => {
  $('.h, .s, .l').bind("input", function(e) {
    const index = parseInt($(this).closest('form').attr('data-unit'));
    const target = $(this).attr('class');
    const value = parseInt($(this).val());
    port.postMessage({type: 'update', index, target, value});

    // TODO update UI side
    updateColors(index,target,value);
  });
};

const setColorsOnSlider = (color, $target) => {
  console.log($target);
  const lForH = (color.l > 99) ? 99 : color.l;
  $target.find('.h').css('background-image', `linear-gradient(
    90deg,
    hsl(0, ${color.s}%, ${lForH}%),
    hsl(60, ${color.s}%, ${lForH}%),
    hsl(120, ${color.s}%, ${lForH}%),
    hsl(180, ${color.s}%, ${lForH}%),
    hsl(240, ${color.s}%, ${lForH}%),
    hsl(300, ${color.s}%, ${lForH}%),
    hsl(360, ${color.s}%, ${lForH}%)`);
  $target.find('.s').css('background-image', `linear-gradient(
    90deg,
    hsl(${color.h},0%, ${color.l}%),
    hsl(${color.h},100%, ${color.l}%)`);
  $target.find('.l').css('background-image', `linear-gradient(
    90deg,
    hsl(${color.h}, ${color.s}%, 0%),
    hsl(${color.h}, ${color.s}%, 100%)`);
  $target.css('border-top', `3px solid hsl(${color.h},${color.s}%,${color.l}%)`);
};

const updateColors = (index, target, value) => {
  appColors[index][target] = value;
  const color = appColors[index];
  const $target = $('.picker-set').eq(index);
  setColorsOnSlider(color, $target);
};
