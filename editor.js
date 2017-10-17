const port = browser.runtime.connect({name:"color port"});

let appColors = [];

port.onMessage.addListener((message) => {
  initSliders(message.colors);
  bindSliders();
  bindNumInputs();
});

// get default colors from background and set original slider values
const initSliders = (colors) => {
  let i = 0;
  for (let color of colors) {
    console.log(color);
    $('.swatches').append('<div class="swatch"/>');
    appColors.push(color);
    $('.picker-sets').append(`
      <form class='picker-set' id=${color.slug} data-unit=${i}>
        <h2>${color.name}</h2>
        <label>hue</label>
        <div>
          <input type='range' min='0' max='360' class='h' value=${color.h} tabIndex='-1'/>
          <input type='number' value=${color.h} class='h-text' maxlength="3" max="360" min="0" />
        </div>
        <label>saturation</label>
        <div>
          <input type='range' min='0' max='100' class='s' value=${color.s} tabIndex='-1'/>
          <input type='number' value=${color.s} class='s-text' maxlength="3" max="360" min="0" />
        </div>
        <label>lightness</label>
        <div>
          <input type='range' min='0' max='100' class='l' value=${color.l} tabIndex='-1'/>
          <input type='number' value=${color.l} class='l-text' maxlength="3" max="360" min="0" />
        </div>
      </form>`
    );
    i++;
  };

  $('.picker-set').each(function(index){
    setColorsOnInputs(appColors[index], $(this));
  });
};

const bindNumInputs = () => {
  $('.h-text, .s-text, .l-text').on('input', function(e) {
    const value = parseInt($(this).val());
    const min = $(this).attr('min');
    const max = $(this).attr('max');
    if (value >= min && value <= max) {
      const index = parseInt($(this).closest('form').attr('data-unit'));
      const target = $(this).attr('class').slice(0,1);
      port.postMessage({type: 'update', index, target, value});
      updateColors(index, target, value, 'text');
    }
  })};


// bind changes to each slider
const bindSliders = () => {
  $('.h, .s, .l').bind("input", function(e) {
    const index = parseInt($(this).closest('form').attr('data-unit'));
    const target = $(this).attr('class');
    const value = parseInt($(this).val());
    port.postMessage({type: 'update', index, target, value});
    updateColors(index, target, value, 'sliders');
  });
};

const setColorsOnInputs = (color, $target, source) => {
  const lForH = (color.l > 99) ? 99 : color.l;
  const $h = $target.find('.h');
  const $s = $target.find('.s');
  const $l = $target.find('.l');
  $h.css('background-image', `linear-gradient(
    90deg,
    hsl(0, ${color.s}%, ${lForH}%),
    hsl(60, ${color.s}%, ${lForH}%),
    hsl(120, ${color.s}%, ${lForH}%),
    hsl(180, ${color.s}%, ${lForH}%),
    hsl(240, ${color.s}%, ${lForH}%),
    hsl(300, ${color.s}%, ${lForH}%),
    hsl(360, ${color.s}%, ${lForH}%)`);
  $s.css('background-image', `linear-gradient(
    90deg,
    hsl(${color.h},0%, ${color.l}%),
    hsl(${color.h},100%, ${color.l}%)`);
  $l.css('background-image', `linear-gradient(
    90deg,
    hsl(${color.h}, ${color.s}%, 0%),
    hsl(${color.h}, ${color.s}%, 100%)`);
  $target.css('border-top', `3px solid hsl(${color.h},${color.s}%,${color.l}%)`);
  if (source === 'sliders') {
    $target.find('.h-text').val(color.h);
    $target.find('.s-text').val(color.s);
    $target.find('.l-text').val(color.l);
  } else if (source === 'text') {
    $h.val(color.h);
    $s.val(color.s);
    $l.val(color.l);
  }
};


// update colors
const updateColors = (index, target, value, source) => {
  appColors[index][target] = value;
  const color = appColors[index];
  const $target = $('.picker-set').eq(index);
  setColorsOnInputs(color, $target, source);
};
