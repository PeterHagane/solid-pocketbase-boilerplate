/* @refresh reload */
import { render } from 'solid-js/web'
import App from './app/app.tsx'
import { addFillToIconsWithClass } from './utils/CssUtils.ts';
import { iconFill } from './app/stores/themesStore.ts';
import { currentLocale, monitorDataTranslateElements, oldLocale, translatePage } from './app/stores/translationStore.ts';
import tippy, { Instance, Props } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { syncTippyInstances } from './utils/init.ts';
// import './index.css'

const root = document.getElementById('root')

render(() => <App />, root!)

let tpInstances: Instance<Props>[] = []

export const observer = new MutationObserver(() => {
  // addFillToIconsWithClass(iconFill);
  syncTippyInstances(tpInstances)
});

function observeDOMChanges() {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

monitorDataTranslateElements()

document.addEventListener('DOMContentLoaded', () => {
  translatePage(oldLocale(), currentLocale())
  addFillToIconsWithClass(iconFill); // Change 'blue' to your desired fill color
  tpInstances = tippy('[data-tooltip]',{
    theme: "tippy-custom",
    content: (el) => el.getAttribute('data-tooltip') || '',
    arrow: false,
    offset: [0, 3]
  })
  observeDOMChanges()
});

