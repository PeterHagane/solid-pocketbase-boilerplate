import { notify } from "../app/components/notify";

export const changeBackgroundOfElementById = (id: string) => {
    console.log(id) //wip
}

export function overWriteCssVariable(cssVariable: string, newValue: string){
    document.documentElement.style.setProperty(cssVariable, newValue)
}

export function addFillToIconsWithClass(fillColor: string) {
    // Select all SVG elements with the class "fill"
    const svgIcons = document.querySelectorAll('svg.fill');

    // Loop through each SVG element and set the fill color
    svgIcons.forEach(svg => {
        // Set the fill attribute for the entire SVG
        svg.setAttribute('fill', fillColor);

        // Optionally, set the fill for paths and shapes within the SVG
        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
            path.setAttribute('fill', fillColor);
        });

        // Set the fill for other shapes like circles, rects, etc.
        const circles = svg.querySelectorAll('circle');
        circles.forEach(circle => {
            circle.setAttribute('fill', fillColor);
        });

        const rects = svg.querySelectorAll('rect');
        rects.forEach(rect => {
            rect.setAttribute('fill', fillColor);
        });

        // Add more shapes as needed
    });
}

export function getCssVariable(variable: string): string {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(variable);
    return value.trim();
}
// Usage
// const mainColor = getCssVariable('--main-color');
// console.log(mainColor); // Outputs: #3498db

export function getFirstDataVariable(variable: string): string | null {
    //data-var (e.g. data-theme in index.html) must be unique
    const element = document.querySelector(`[data-${variable}]`) as HTMLElement;
    return element ? element.getAttribute(`data-${variable}`) : null;
}