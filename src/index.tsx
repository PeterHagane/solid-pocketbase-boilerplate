/* @refresh reload */
import { render } from 'solid-js/web'
import App from './app/app.tsx'
import { addFillToIconsWithClass } from './utils/CssUtils.ts';
import { iconFill } from './app/stores/themesStore.ts';
import { currentLocale, monitorDataTranslateElements, oldLocale, translatePage } from './app/stores/translationStore.ts';
// import './index.css'

const root = document.getElementById('root')

render(() => <App />, root!)

export const observer = new MutationObserver(() => {
  addFillToIconsWithClass(iconFill);
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
  observeDOMChanges()
});


