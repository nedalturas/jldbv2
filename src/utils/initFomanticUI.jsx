export function initFomanticUI() {
  if (typeof window !== 'undefined' && window.$) {
    window.$('.ui.dropdown').dropdown();
    window.$('.ui.modal').modal();
    window.$('.ui.checkbox').checkbox();
    window.$('.ui.accordion').accordion();
    window.$('.ui.popup').popup();
    window.$('.ui.sticky').sticky();
  }
}
